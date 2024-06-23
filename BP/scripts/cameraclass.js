/*

-- This script was made with Gamerelk's camera presets!

*/
import { system, world, EntityType } from '@minecraft/server'

class Camera {

    constructor(Player = EntityType, { EaseType = "Linear", EaseTime = 0.15 } = {}) {

        this.Player = Player
        this.EaseType = EaseType
        this.EaseTime = EaseTime

        if (Camera.HasRunOnce === undefined) {
            Camera.HasRunOnce = false;
        }
    }

    BirdsEyeView(YRange = 1, { UseCameraFunction = true } = {}) {

        const Player = this.Player
        const YCameraRange = YRange
        const UseCamera = UseCameraFunction
        const EaseType = this.EaseType
        const EaseTime = this.EaseTime

        const Vector2 = {
            x: 90,
            y: 0
        }

        const CameraPosition = {
            x: Player.getHeadLocation().x,
            y: Player.getHeadLocation().y + YCameraRange,
            z: Player.getHeadLocation().z
        }

        if (UseCamera === false) {
            return Vector3
        }

        if (UseCamera === true) {
            Player.camera.setCamera("dungeonscombat:free", { easeOptions: { easeTime: EaseTime, easeType: EaseType }, rotation: Vector2, location: CameraPosition });
        }
    }

    CircularMotion(Range = 5, { MotionSpeed = 0.02, TransitionTime = 5 } = {}) {

        const Player = this.Player;
        const CameraRange = Range;
        const EaseType = this.EaseType;
        const EaseTime = this.EaseTime;

        const TwoPi = Math.PI * 2;
        let Angle = 0;
        let AngleIncrement = MotionSpeed;

        function CameraLocationRotatingAroundEntity() {
            const PlayerPosition = Player.location;

            const CameraPosition = {
                x: PlayerPosition.x + CameraRange * Math.cos(Angle),
                y: PlayerPosition.y + 2,
                z: PlayerPosition.z + CameraRange * Math.sin(Angle)
            };

            return CameraPosition;
        }

        function UpdateCameraMotion() {

            const NewAngle = (Angle + AngleIncrement) % TwoPi;

            const AngleDifference = (NewAngle - Angle + TwoPi) % TwoPi;

            Angle = (Angle + AngleDifference) % TwoPi;

            const CameraPosition = CameraLocationRotatingAroundEntity();

            Player.camera.setCamera("dungeonscombat:free", { easeOptions: { easeTime: EaseTime, easeType: EaseType }, location: CameraPosition, facingEntity: Player });

            system.runTimeout(UpdateCameraMotion, TransitionTime);
        }

        if (!Camera.HasRunOnce) {
            Camera.HasRunOnce = true
            UpdateCameraMotion();
        }
    }

    CameraAttachToEntity(AttachedEntity, Range = 1, { UseCameraFunction = true, OffsetY = 0, AlterRotation = { x: 0, y: 0 } } = {}) {

        const Player = this.Player;
        const AttachingEntity = AttachedEntity;
        const CameraRange = Range;
        const UseCamera = UseCameraFunction;
        const YOffset = OffsetY
        const EaseType = this.EaseType;
        const EaseTime = this.EaseTime;
        const Rotation = AlterRotation

        const AttachedEntityLocation = AttachingEntity.getHeadLocation();
        const AttachedEntityView = AttachingEntity.getViewDirection()

        function CameraFollowEntityPosition() {

            const X = AttachedEntityView.x * CameraRange
            const Y = AttachedEntityView.y * CameraRange
            const Z = AttachedEntityView.z * CameraRange

            const CameraPosition = {
                x: AttachedEntityLocation.x - X,
                y: AttachedEntityLocation.y - Y + YOffset,
                z: AttachedEntityLocation.z - Z
            };

            return CameraPosition;
        }

        const Vector2 = {
            x: AttachingEntity.getRotation().x + Rotation.x,
            y: AttachingEntity.getRotation().y + Rotation.y
        }

        if (UseCamera === true) {
            Player.camera.setCamera("dungeonscombat:free", { easeOptions: { easeTime: EaseTime, easeType: EaseType }, location: CameraFollowEntityPosition(), rotation: Vector2 });
        };

        if (UseCamera === false) {
            return CameraFollowEntityPosition()
        }
    }

    BehindPlayerFocusOnEntity(FocusEntity = EntityType, FocusEntityLockedToPlayer = false, Range = 1, { UseCameraFunction = true, CanBlockObstructView = false, OffsetX = 0, OffsetY = 2, OffsetZ = 0 } = {}) {

        const Player = this.Player
        const FocusedEntity = FocusEntity
        const FocusIsLocked = FocusEntityLockedToPlayer
        const CameraRange = Range
        const UseCamera = UseCameraFunction
        const BlockObstruction = CanBlockObstructView
        const XOffset = OffsetX
        const YOffset = OffsetY
        const ZOffset = OffsetZ
        const EaseType = this.EaseType
        const EaseTime = this.EaseTime

        const PlayerPosition = Player.location;
        const FocusedEntityPosition = FocusedEntity.location;

        function FocusOntoPlayer() {

            const Direction = {
                x: PlayerPosition.x - FocusedEntityPosition.x,
                y: PlayerPosition.y - FocusedEntityPosition.y,
                z: PlayerPosition.z - FocusedEntityPosition.z
            };

            const Pitch = Math.atan2(Direction.y, Math.sqrt(Direction.x * Direction.x + Direction.z * Direction.z)) / Math.PI * 180;
            const Yaw = Math.atan2(Direction.x, Direction.z) / Math.PI * 180;

            const NewRotation = {
                x: Pitch,
                y: -Yaw
            }

            return NewRotation
        }

        function CameraFocusOntoEntity() {

            const Direction = {
                x: FocusedEntityPosition.x - PlayerPosition.x,
                y: FocusedEntityPosition.y - PlayerPosition.y,
                z: FocusedEntityPosition.z - PlayerPosition.z
            };

            const Length = Math.sqrt(Direction.x * Direction.x + Direction.y * Direction.y + Direction.z * Direction.z);

            const NormalizedDirection = {
                x: Direction.x / Length,
                y: Direction.y / Length,
                z: Direction.z / Length
            };

            let CurrentCameraRange = CameraRange;

            let CameraPosition = {
                x: PlayerPosition.x - NormalizedDirection.x * CurrentCameraRange + XOffset,
                y: PlayerPosition.y - NormalizedDirection.y * CurrentCameraRange + YOffset,
                z: PlayerPosition.z - NormalizedDirection.z * CurrentCameraRange + ZOffset
            };

            if (BlockObstruction === false) {

                function IsInsideBlock(CameraPosition) {
                    const TestBlock = world.getDimension(Player.dimension.id).getBlock(CameraPosition);

                    if (TestBlock.isAir || TestBlock.isLiquid === true) {
                        return true
                    } else {
                        false
                    }
                }

                while (IsInsideBlock(CameraPosition) !== true) {

                    CurrentCameraRange -= 0.2;

                    CameraPosition = {
                        x: PlayerPosition.x - NormalizedDirection.x * CurrentCameraRange + XOffset,
                        y: PlayerPosition.y - NormalizedDirection.y * CurrentCameraRange + YOffset,
                        z: PlayerPosition.z - NormalizedDirection.z * CurrentCameraRange + ZOffset
                    };

                    if (CurrentCameraRange < 0.2) {
                        CameraPosition = { x: PlayerPosition.x, y: PlayerPosition.y, z: PlayerPosition.z };
                    }
                }
            }
            return CameraPosition;
        }

        if (UseCamera === true) {

            if (FocusIsLocked === true) {
                FocusEntity.setRotation(FocusOntoPlayer())
            }

            Player.camera.setCamera("dungeonscombat:free", { easeOptions: { easeTime: EaseTime, easeType: EaseType }, location: CameraFocusOntoEntity(), facingEntity: FocusedEntity });
        }

        if (UseCamera === false) {
            return CameraPosition
        }
    }

    BehindPlayerFocusOnLocation(FocusLocation = { x: 0, y: 0, z: 0 }, Range = 1, { UseCameraFunction = true, CanBlockObstructView = false, OffsetX = 0, OffsetY = 2, OffsetZ = 0 } = {}) {

        const Player = this.Player
        const CameraRange = Range
        const UseCamera = UseCameraFunction
        const BlockObstruction = CanBlockObstructView
        const XOffset = OffsetX
        const YOffset = OffsetY
        const ZOffset = OffsetZ
        const EaseType = this.EaseType
        const EaseTime = this.EaseTime

        const PlayerPosition = Player.location;
        const FocusedLocation = FocusLocation

        function CameraFocusOntoLocation() {

            const Direction = {
                x: FocusedLocation.x - PlayerPosition.x,
                y: FocusedLocation.y - PlayerPosition.y,
                z: FocusedLocation.z - PlayerPosition.z
            };

            const Length = Math.sqrt(Direction.x * Direction.x + Direction.y * Direction.y + Direction.z * Direction.z);

            const NormalizedDirection = {
                x: Direction.x / Length,
                y: Direction.y / Length,
                z: Direction.z / Length
            };

            let CurrentCameraRange = CameraRange;

            let CameraPosition = {
                x: PlayerPosition.x - NormalizedDirection.x * CurrentCameraRange + XOffset,
                y: PlayerPosition.y - NormalizedDirection.y * CurrentCameraRange + YOffset,
                z: PlayerPosition.z - NormalizedDirection.z * CurrentCameraRange + ZOffset
            };

            if (BlockObstruction === false) {

                function IsInsideBlock(CameraPosition) {
                    const TestBlock = world.getDimension(Player.dimension.id).getBlock(CameraPosition);

                    if (TestBlock.isAir || TestBlock.isLiquid === true) {
                        return true
                    } else {
                        false
                    }
                }

                while (IsInsideBlock(CameraPosition) !== true) {

                    CurrentCameraRange -= 0.2;

                    CameraPosition = {
                        x: PlayerPosition.x - NormalizedDirection.x * CurrentCameraRange + XOffset,
                        y: PlayerPosition.y - NormalizedDirection.y * CurrentCameraRange + YOffset,
                        z: PlayerPosition.z - NormalizedDirection.z * CurrentCameraRange + ZOffset
                    };

                    if (CurrentCameraRange < 0.2) {
                        CameraPosition = { x: PlayerPosition.x, y: PlayerPosition.y, z: PlayerPosition.z };
                    }
                }
            }
            return CameraPosition
        }

        if (UseCamera === true) {
            Player.camera.setCamera("dungeonscombat:free", { easeOptions: { easeTime: EaseTime, easeType: EaseType }, location: CameraFocusOntoLocation(), facingLocation: FocusedLocation });
        }

        if (UseCamera === false) {
            return CameraPosition
        }
    }

    CameraViewSide(RangeX = 0, RangeZ = 0, { OffsetY = 0, AlterRotationY = 0 } = {}) {

        const Player = this.Player;
        const CameraRangeX = RangeX
        const CameraRangeZ = RangeZ
        const YOffset = OffsetY
        const EaseType = this.EaseType
        const EaseTime = this.EaseTime

        const PlayerPosition = Player.getHeadLocation()

        const CameraPosition = {
            x: PlayerPosition.x + CameraRangeX,
            y: PlayerPosition.y + YOffset,
            z: PlayerPosition.z + CameraRangeZ
        };

        const Vector2 = {
            x: 0,
            y: AlterRotationY
        }


        Player.camera.setCamera("dungeonscombat:free", { easeOptions: { easeTime: EaseTime, easeType: EaseType }, rotation: Vector2, location: CameraPosition });
    }
}

export { Camera }