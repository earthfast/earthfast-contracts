// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "./EarthfastNodes.sol";
import "./EarthfastOperators.sol";
import "./EarthfastRegistry.sol";
import "./EarthfastReservations.sol";
import "./EarthfastTypes.sol";

/// @title Entry point for managing projects that host content on the network
contract EarthfastProjects is AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  // Controls who can do data import during contract initialization
  bytes32 public constant IMPORTER_ROLE = keccak256("IMPORTER_ROLE");

  EarthfastRegistry private _registry;

  mapping(bytes32 => EarthfastProject) private _projects;
  EnumerableSet.Bytes32Set private _projectIds;

  event ProjectCreated(bytes32 indexed projectId, address indexed owner, string name, string email, string content, bytes32 checksum, string metadata);
  event ProjectDeleted(bytes32 indexed projectId, address indexed owner, string name, string email, string content, bytes32 checksum, string metadata);
  event ProjectOwnerChanged(bytes32 indexed projectId, address indexed oldOwner, address indexed newOwner);
  event ProjectPropsChanged(bytes32 indexed projectId, string oldName, string oldEmail, string newName, string newEmail);
  event ProjectEscrowChanged(bytes32 indexed projectId, uint256 oldEscrow, uint256 newEscrow);
  event ProjectContentChanged(bytes32 indexed projectId, string oldContent, bytes32 oldChecksum, string newContent, bytes32 newChecksum);
  event ProjectMetadataChanged(bytes32 indexed projectId, string oldMetadata, string newMetadata);

  modifier onlyImpl {
    require(
      msg.sender == address(_registry.getBilling()) ||
      msg.sender == address(_registry.getNodes()) ||
      msg.sender == address(_registry.getOperators()) ||
      msg.sender == address(_registry.getReservations()),
      "not impl");
    _;
  }

  modifier onlyAdmin {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    _;
  }

  modifier onlyProjectOwner(bytes32 projectId) {
    EarthfastProject storage project = _projects[projectId];
    require(project.id != 0, "unknown project");
    require(msg.sender == project.owner, "not project owner");
    _;
  }

  modifier onlyAdminOrProjectOwner(bytes32 projectId) {
    EarthfastProject storage project = _projects[projectId];
    require(project.id != 0, "unknown project");
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
      msg.sender == project.owner, "not admin or project owner");
    _;
  }

  modifier whenNotReconciling() {
    _registry.requireNotReconciling();
    _;
  }

  /// @dev Called once to set up the contract. Not called during proxy upgrades.
  ///
  /// @param grantImporterRole allows the contract deployer to import initial data into
  /// the contract using unsafeImport* functions, which is used for proxy-less upgrades.
  /// CAUTION: Once import is finished, the importer role should be explicitly revoked.
  function initialize(address[] calldata admins, EarthfastRegistry registry, bool grantImporterRole)
  public initializer {
    __Context_init();
    __ERC165_init();
    __ERC1967Upgrade_init();
    __AccessControl_init();
    __Pausable_init();
    __ReentrancyGuard_init();
    __UUPSUpgradeable_init();

    _registry = registry;
    require(admins.length > 0, "no admins");
    for (uint256 i = 0; i < admins.length; ++i) {
      require(admins[i] != address(0), "zero admin");
      _grantRole(DEFAULT_ADMIN_ROLE, admins[i]);
    }

    if (grantImporterRole) {
      // solhint-disable-next-line avoid-tx-origin
      _grantRole(IMPORTER_ROLE, tx.origin); // Only the contract deployer will have this role
      _setRoleAdmin(IMPORTER_ROLE, IMPORTER_ROLE); // Admin must not be able to grant this role
    }
  }

  /// @dev Reverts if proxy upgrade of this contract by msg.sender is not allowed
  function _authorizeUpgrade(address) internal virtual override onlyAdmin {}

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetRegistry(EarthfastRegistry registry) public virtual onlyAdmin { _registry = registry; }

  /// @dev Allows to import initial contract data. Used for proxy-less upgrades.
  /// @param revokeImporterRole stops further data import by revoking the role.
  /// CAUTION: Once import is finished, the role should be explicitly revoked.
  function unsafeImportData(EarthfastProject[] calldata projects, bool revokeImporterRole)
  public onlyRole(IMPORTER_ROLE) {
    for (uint256 i = 0; i < projects.length; i++) {
      _projects[projects[i].id] = projects[i];
      require(_projectIds.add(projects[i].id), "duplicate id");
    }
    if (revokeImporterRole) {
      _revokeRole(IMPORTER_ROLE, msg.sender);
    }
  }

  /// @dev Adjusts multiple projects escrows relative to their current values.
  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetEscrows(uint256 skip, uint256 size, uint256 mul, uint256 div)
  public virtual onlyAdmin {
    require(mul != 0, "zero mul");
    uint256 length = _projectIds.length();
    uint256 n = Math.min(size, length > skip ? length - skip : 0);
    for (uint256 i = 0; i < n; i++) {
      EarthfastProject storage project = _projects[_projectIds.at(skip + i)];
      project.escrow = project.escrow * mul / div;
      project.reserve = project.reserve * mul / div;
    }
  }

  function pause() public virtual onlyAdmin { _pause(); }
  function unpause() public virtual onlyAdmin { _unpause(); }

  function getRegistry() public virtual view returns (EarthfastRegistry) { return _registry; }

  function setProjectEscrowImpl(bytes32 projectId, uint256 decrease, uint256 increase)
  public virtual onlyImpl whenNotPaused {
    EarthfastProject storage project = _projects[projectId];
    require(project.id != 0, "unknown project");
    project.escrow -= decrease;
    project.escrow += increase;
  }

  function setProjectReserveImpl(bytes32 projectId, uint256 decrease, uint256 increase)
  public virtual onlyImpl whenNotPaused {
    EarthfastProject storage project = _projects[projectId];
    require(project.id != 0, "unknown project");
    project.reserve -= decrease;
    project.reserve += increase;
  }

  /// @notice Registers a new project.
  /// @dev Does not check name or email for validity or uniqueness
  function createProject(EarthfastCreateProjectData memory project)
  public whenNotReconciling whenNotPaused returns (bytes32 projectId) {
    require(project.owner != address(0), "zero owner");
    require(bytes(project.name).length > 0, "empty name");
    require(bytes(project.name).length <= EARTHFAST_MAX_NAME_BYTES, "name too long");
    require(bytes(project.email).length <= EARTHFAST_MAX_EMAIL_BYTES, "email too long");
    require(bytes(project.content).length <= EARTHFAST_MAX_CONTENT_BYTES, "content too long");
    require(bytes(project.metadata).length <= EARTHFAST_MAX_METADATA_BYTES, "metadata too long");
    projectId = keccak256(abi.encodePacked(_registry.newNonceImpl()));
    _projects[projectId] = EarthfastProject({
      id: projectId, owner: project.owner, name: project.name, email: project.email, escrow: 0, reserve: 0,
      content: project.content, checksum: project.checksum, metadata: project.metadata
    });
    assert(_projectIds.add(projectId));
    emit ProjectCreated(projectId, project.owner, project.name, project.email, project.content, project.checksum, project.metadata);
  }

  /// @notice Unregisters a project. Reverts if project has escrow or reservations.
  function deleteProject(bytes32 projectId)
  public virtual onlyAdminOrProjectOwner(projectId) whenNotReconciling whenNotPaused {
    EarthfastProject memory projectCopy = _projects[projectId];
    assert(projectCopy.id != 0); // Impossible because of onlyProjectOwner
    EarthfastReservations reservations = _registry.getReservations();
    require(reservations.getReservationCount(projectId) == 0, "project has reservations");
    require(projectCopy.escrow == 0, "project has escrow");
    delete _projects[projectId];
    assert(_projectIds.remove(projectId));
    emit ProjectDeleted(projectId, projectCopy.owner, projectCopy.name, projectCopy.email, projectCopy.content, projectCopy.checksum, projectCopy.metadata);
  }

  function setProjectOwner(bytes32 projectId, address owner)
  public virtual onlyAdminOrProjectOwner(projectId) whenNotReconciling whenNotPaused {
    require(owner != address(0), "zero owner");
    EarthfastProject storage project = _projects[projectId];
    assert(project.id != 0); // Impossible because of onlyAdminOrProjectOwner
    address oldOwner = project.owner;
    project.owner = owner;
    emit ProjectOwnerChanged(projectId, oldOwner, owner);
  }

  /// @dev Does not check name or email for validity or uniqueness
  function setProjectProps(bytes32 projectId, string calldata name, string calldata email)
  public virtual onlyProjectOwner(projectId) whenNotReconciling whenNotPaused {
    require(bytes(name).length > 0, "empty name");
    require(bytes(name).length <= EARTHFAST_MAX_NAME_BYTES, "name too long");
    require(bytes(email).length <= EARTHFAST_MAX_EMAIL_BYTES, "email too long");
    EarthfastProject storage project = _projects[projectId];
    assert(project.id != 0); // Impossible because of onlyProjectOwner
    string memory oldName = project.name;
    string memory oldEmail = project.email;
    project.name = name;
    project.email = email;
    emit ProjectPropsChanged(projectId, oldName, oldEmail, name, email);
  }

  /// @notice Publishes new content on the network
  function setProjectContent(bytes32 projectId, string calldata content, bytes32 checksum)
  public virtual onlyProjectOwner(projectId) whenNotReconciling whenNotPaused {
    require(bytes(content).length <= EARTHFAST_MAX_CONTENT_BYTES, "content too long");
    EarthfastProject storage project = _projects[projectId];
    assert(project.id != 0); // Impossible because of onlyProjectOwner
    string memory oldContent = project.content;
    bytes32 oldChecksum = project.checksum;
    project.content = content;
    project.checksum = checksum;
    emit ProjectContentChanged(projectId, oldContent, oldChecksum, content, checksum);
  }

  /// @notice Sets project metadata
  function setProjectMetadata(bytes32 projectId, string calldata metadata)
  public virtual onlyProjectOwner(projectId) whenNotReconciling whenNotPaused {
    require(bytes(metadata).length <= EARTHFAST_MAX_METADATA_BYTES, "metadata too long");
    EarthfastProject storage project = _projects[projectId];
    assert(project.id != 0); // Impossible because of onlyProjectOwner
    string memory oldMetadata = project.metadata;
    project.metadata = metadata;
    emit ProjectMetadataChanged(projectId, oldMetadata, project.metadata);
  }

  /// @notice Transfers USDC into the contract and applies them toward given operator stake.
  /// @dev Needs either a token allowance from projectFunder, or a gasless approval (v/r/s != 0).
  /// This is used instead of explicit input checks to enable third party funding and calling by an Entrypoint proxy contract.
  /// @dev CAUTION: To avoid loss of funds, do NOT deposit to this contract by token.transfer().
  /// @param projectFunder The wallet funding the escrow deposit for the the project.
  /// @param projectId The ID of the project.
  /// @param amount The amount of USDC to deposit.
  /// @param deadline The deadline for the permit.
  /// @param v The v value of the permit.
  /// @param r The r value of the permit.
  /// @param s The s value of the permit.
  function depositProjectEscrow(address projectFunder, bytes32 projectId, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
  public virtual whenNotPaused {
    EarthfastProject storage project = _projects[projectId];
    require(project.id != 0, "unknown project");
    uint256 oldEscrow = project.escrow;
    project.escrow += amount;
    if (s != 0) {
      _registry.getUSDC().permit(projectFunder, address(this), amount, deadline, v, r, s);
    } else {
      require(deadline == 0 && v == 0 && r == 0, "invalid permit");
    }
    _registry.getUSDC().transferFrom(projectFunder, address(_registry), amount);
    emit ProjectEscrowChanged(projectId, oldEscrow, project.escrow);
  }

  /// @notice Transfers escrow from contract to given recipient. Reverts if escrow is reserved.
  function withdrawProjectEscrow(bytes32 projectId, uint256 amount, address to)
  public virtual nonReentrant onlyAdminOrProjectOwner(projectId) whenNotReconciling whenNotPaused {
    EarthfastProject storage project = _projects[projectId];
    assert(project.id != 0); // Impossible because of onlyAdminOrProjectOwner
    require(project.escrow >= project.reserve + amount, "not enough escrow");
    uint256 oldEscrow = project.escrow;
    project.escrow -= amount;
    _registry.getUSDC().transferFrom(address(_registry), to, amount);
    emit ProjectEscrowChanged(projectId, oldEscrow, project.escrow);
  }

  /// @dev Reverts if the id is unknown
  function getProject(bytes32 projectId)
  public virtual view returns (EarthfastProject memory) {
    EarthfastProject memory project = _projects[projectId];
    require(project.id != 0, "unknown project");
    return project;
  }

  function getProjectCount()
  public virtual view returns (uint256) {
    return _projectIds.length();
  }

  /// @dev Truncates the results if skip or size are out of bounds
  function getProjects(uint256 skip, uint256 size)
  public virtual view returns (EarthfastProject[] memory values) {
    uint256 length = _projectIds.length();
    uint256 n = Math.min(size, length > skip ? length - skip : 0);
    values = new EarthfastProject[](n);
    for (uint256 i = 0; i < n; i++) {
      values[i] = _projects[_projectIds.at(skip + i)];
    }
  }

  // Reserve storage for future upgrades
  uint256[10] private __gap;

}
