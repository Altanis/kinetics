import Momentum from "../static/latex/momentum.png";
import KE from "../static/latex/kinetic_energy.png";
import MA from "../static/latex/motion_approximation.png";
import AV from "../static/latex/angular_velocity.png";
import Shoelace from "../static/latex/shoelace.png";

import SAT from "../static/latex/SAT.svg";
import SAT2 from "../static/latex/SAT2.svg";

import CI from "../static/latex/collision_impulse.png";
import CAV from "../static/latex/collision_angvel.png";
import CP from "../static/latex/collision_position.png";

import VD from "../static/latex/vector_distance.png";
import DOT from "../static/latex/vector_dot.png";
import VC1 from "../static/latex/vector_cross_1.png";
import VC2 from "../static/latex/vector_cross_2.png";
import VC3 from "../static/latex/vector_cross_3.png";
import VP from "../static/latex/vector_project.png";
import VN from "../static/latex/vector_normal.png";

export default [
    {
        name: "Home",
        children: [
            {
                name: "Introduction",
                link: "/docs",
            },
            {
                name: "Demo",
                link: "/docs/demo",
            }
        ]        
    },
    {
        name: "Classes",
        children: [
            {
                name: "System",
                link: "/docs/classes/system",
                importStatement: "import { System } from \"kinetics.ts\";",
                exportStatement: "export default class System { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The System class is the base class where all entities are managed."
                    },
                    {
                        // logo: "text-accent fas fa-cube",
                        name: "Constructor",
                        parameters: "constructor(config)",
                        table: [{
                            "Name": "config",
                            "Type": "SystemConfig",
                            "Optional": "No",
                            "Description": "The configuration object for the system."
                        }]
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "camera",
                                returnType: "Camera",
                                description: "The camera viewing the system.",
                            },
                            {
                                keyword: "public",
                                name: "renderer",
                                returnType: "Renderer",
                                description: "The renderer rendering the system.",
                            },
                            {
                                keyword: "public",
                                name: "width",
                                returnType: "number | null",
                                description: "The width of the system provided by the `SystemConfig.dimensions.x` property.",
                            },
                            {
                                keyword: "public",
                                name: "height",
                                returnType: "number | null",
                                description: "The height of the system provided by the `SystemConfig.dimensions.y` property.",
                            },
                            {
                                keyword: "public",
                                name: "friction",
                                returnType: "number",
                                defaultsTo: "0.1",
                                description: "The friction of the system.",
                            },
                            {
                                keyword: "public",
                                name: "gravity",
                                returnType: "number",
                                defaultsTo: "0",
                                description: "The gravity in the system.",
                            },
                            {
                                keyword: "public",
                                name: "CollisionManager",
                                returnType: "CollisionManager",
                                description: "The engine which partitions the system and efficiently checks for collisions.",
                            },
                            {
                                keyword: "public",
                                name: "CollisionResolver",
                                returnType: "CollisionResolver",
                                description: "The engine which detects and resolves collisions."
                            },
                            {
                                keyword: "public",
                                name: "entities",
                                returnType: "Entity[]",
                                description: "The entities in the system, with undefined entities being old, deleted entities.",
                            },
                            {
                                keyword: "public",
                                name: "config",
                                returnType: "SystemConfig",
                                description: "The configuration object for the system.",
                            },
                            {
                                keyword: "public",
                                name: "verbose",
                                returnType: "boolean",
                                defaultsTo: "false",
                                description: "Whether or not to log information about the system to the console.",
                            },
                            {
                                keyword: "public",
                                name: "tick",
                                returnType: "number",
                                description: "The amount of ticks elapsed since the start of the engine.",
                            },
                            {
                                keyword: "public",
                                name: "tickRate",
                                returnType: "number",
                                description: "The amount of tick cycles that occur in one second.",
                            },
                            {
                                keyword: "public",
                                name: "environment",
                                returnType: "Environment",
                                description: "The environment the system is running in.",
                            },
                            {
                                keyword: "public",
                                name: "performance",
                                returnType: "{ worldUpdateRate: number, memoryUsage: number }",
                                description: "The performance of the system. `worldUpdateRate` is the amount of time it takes to update the system, and `memoryUsage` is the amount of memory the system is using.",
                            },
                            {
                                keyword: "public",
                                name: "momentum",
                                returnType: "number",
                                description: "The total linear and angular momentum in the system<nerd>, represented as a scalar</nerd>.",
                                latex: [Momentum]
                            },
                            {
                                keyword: "public",
                                name: "kineticEnergy",
                                returnType: "number",
                                description: "The total kinetic energy in the system.",
                                latex: [KE]
                            },
                        ],
                    },
                    {
                        // logo: "text-[#BC8CFF] fas fa-cube",
                        name: "Methods",
                        data: [
                            {
                                keyword: "public",
                                name: "setCollisionEngine(engine)",
                                returnType: "void",
                                description: "Sets the binary partitioning engine of the system for broadphase collision detection.",
                                table: [
                                    {
                                        "Name": "engine",
                                        "Type": "CollisionManager",
                                        "Optional": "No",
                                        "Description": "The binary partitioning and broadphase detection engine to use."
                                    }
                                ]
                            },
                            {
                                keyword: "private",
                                name: "update()",
                                returnType: "void",
                                description: "Updates the system. One completion of this is referred to as a tick.",
                                table: [],
                            },
                            {
                                keyword: "public",
                                name: "addEntity(entity)",
                                returnType: "Entity",
                                description: "Adds an entity to the system.",
                                table: [
                                    {
                                        "Name": "entity",
                                        "Type": "Entity",
                                        "Optional": "No",
                                        "Description": "The entity to add to the system."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "removeEntity(entity)",
                                returnType: "Entity",
                                description: "Removes an entity from the system.",
                                table: [
                                    {
                                        "Name": "entity",
                                        "Type": "Entity",
                                        "Optional": "No",
                                        "Description": "The entity to remove from the system."
                                    }
                                ]
                            }
                        ],
                    }
                ],
            },
            {
                name: "Entity",
                link: "/docs/classes/entity",
                importStatement: "import { Bodies: { Entity } } from \"kinetics.ts\";",
                exportStatement: "export default class Entity { ... }",
                children: [
                    {
                        name: "Circle",
                        link: "/docs/classes/entity/circle",
                        importStatement: "import { Bodies: { Circle } } from \"kinetics.ts\";",
                        exportStatement: "export default class Circle extends Entity { ... }",
                        data: [
                            {
                                name: "Summary",
                                description: "The Circle class is a perfectly circular entity. It extends off the Entity class."
                            },
                            {
                                name: "Constructor",
                                parameters: "constructor(info, system)",
                                table: [
                                    {
                                        "Name": "info",
                                        "Type": "CircleInfo",
                                        "Optional": "No",
                                        "Description": "The information about the circle."
                                    },
                                    {
                                        "Name": "system",
                                        "Type": "System",
                                        "Optional": "No",
                                        "Description": "The system the circle is in."
                                    }
                                ]
                            },
                            {
                                name: "Properties",
                                data: [
                                    {
                                        keyword: "public",
                                        name: "radius",
                                        returnType: "number",
                                        description: "The radius of the circle.",
                                    },
                                ]
                            },
                            {
                                name: "Methods",
                                data: []
                            }
                        ]
                    },
                ],
                data: [
                    {
                        name: "Summary",
                        description: "The Entity class is the base class for all types of entities, and can represent all polygonal shapes."
                    },
                    {
                        name: "Constructor",
                        parameters: "constructor(info, system)",
                        table: [
                            {
                                "Name": "info",
                                "Type": "EntityInfo",
                                "Optional": "No",
                                "Description": "The information about the entity."
                            },
                            {
                                "Name": "system",
                                "Type": "System",
                                "Optional": "No",
                                "Description": "The system the entity is in."
                            }
                        ]
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "tick",
                                returnType: "number",
                                description: "The amount of ticks elapsed since entity has spawned.",
                            },
                            {
                                keyword: "public",
                                name: "lastCollisionFrame",
                                returnType: "number",
                                description: "The last tick the entity collided with another entity.",
                            },
                            {
                                keyword: "public",
                                name: "type",
                                returnType: "EntityType",
                            },
                            {
                                keyword: "public",
                                name: "vertices",
                                returnType: "Vector[]",
                                description: "The vertices of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "position",
                                returnType: "Vector",
                                description: "The position, or the center point, of the entity. <nerd>This changes every tick using numerical motion approximations with its respective derivatives, velocity and acceleration. This engine utilizes Euler's method for these numerical approximations. The engine does not explicitly use derivatives due to its assumption of linear motion.</nerd>",
                                latex: [MA]
                            },  
                            {
                                keyword: "public",
                                name: "velocity",
                                returnType: "Vector",
                                description: "The instantaneous rate of change in displacement of the entity. <nerd>This is added to the entity's position every tick after necessary velocity calculations.</nerd>",
                            },
                            {
                                keyword: "public",
                                name: "acceleration",
                                returnType: "Vector",
                                description: "The acceleration of the entity. <nerd>This is added to the entity's velocity every tick after necessary acceleration calculations. The acceleration vector has its magnitude set to the entity's speed every tick to ensure movement exactly at the entity speed per tick.</nerd>",
                            },
                            {
                                keyword: "public",
                                name: "speed",
                                returnType: "number",
                                description: "The speed of the entity. <nerd>The measure of horizontal and vertical displacement in 90 degree motion and is added to the acceleration vector for every `move()` call.</nerd>",
                            },
                            {
                                keyword: "public",
                                name: "mass",
                                returnType: "number",
                            },
                            {
                                keyword: "public",
                                name: "elasticity",
                                returnType: "number",
                                description: "A measure of how bouncy the entity is.",
                            },
                            {
                                keyword: "public",
                                name: "static",
                                returnType: "boolean",
                                description: "Whether or not the entity has the ability to move.",
                            },
                            {
                                keyword: "public",
                                name: "angularVelocity",
                                returnType: "number",
                                description: "The instantaneous rate of change in rotation of the entity. <nerd>This is added to the entity's angle every tick after necessary angular velocity calculations.</nerd>",
                                latex: [AV]
                            },
                            {
                                keyword: "public",
                                name: "angularSpeed",
                                returnType: "number",
                                description: "The speed of the entity's rotation<nerd>, and is added to the entity's angular velocity ever `rotate()` call</nerd>.",
                            },
                            {
                                keyword: "public",
                                name: "components",
                                returnType: "Entity[]",
                                description: "The entities that make up the entity.",
                            },
                            {
                                keyword: "public",
                                name: "parent",
                                returnType: "Entity | null",
                                description: "The parent of the entity. `null` for entities which aren't compound.",
                            },
                            {
                                keyword: "public",
                                name: "hooks",
                                returnType: "{ preResolve: (entity: Entity) => void, postResolve: (entity: Entity) => void }",
                                description: "The hooks for a collision between itself and another entity. `preResolve` is called before the entity collides, and `postResolve` is called after the entities collide.",
                            },
                            {
                                keyword: "public",
                                name: "sleeping",
                                returnType: "boolean",
                                description: "Whether or not the entity is sleeping. <nerd>Sleeping is a state where the entity is not updating, and is not being checked for collisions. It is determined by both linear and angular velocities being less than the `sleepThreshold` provided in the entity config, as well as 5+ ticks elapsing since the last collision.</nerd>",
                            },
                            {
                                keyword: "public",
                                name: "hitbox",
                                returnType: "Vector",
                                description: "A vector where the `x` component represents width, and the `y` component represents height.",
                            },
                            {
                                keyword: "public",
                                name: "inertia",
                                returnType: "number",
                                description: "The moment of inertia of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "angle",
                                returnType: "number",
                                description: "The angle of the entity. It is both a getter and a setter.",
                            },
                            {
                                keyword: "public",
                                name: "id",
                                returnType: "number",
                                description: "The unique identifier of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "system",
                                returnType: "System",
                                description: "The system the entity is in.",
                            },
                            {
                                keyword: "public",
                                name: "bounds",
                                returnType: "{ min: Vector, max: Vector, dimensions: Vector }",
                                description: "Returns the minimum and maximum points of the bounding box around the entity, as well as the dimensions of the bounding box.",
                            },
                            {
                                keyword: "public",
                                name: "area",
                                returnType: "number",
                                description: "The area of the entity. <nerd>It is calculated using the shoelace formula.</nerd>",
                                latex: [Shoelace]
                            },
                            {
                                keyword: "public",
                                name: "rendering",
                                returnType: "EntityRenderingConfig",
                                description: "The rendering configuration of the entity.",
                            }  
                        ]
                    },
                    {
                        name: "Methods",
                        data: [
                            {
                                keyword: "public",
                                name: "configure(config)",
                                returnType: "void",
                                description: "Reconfigures the rendering options for the entity.",
                                table: [
                                    {
                                        "Name": "config",
                                        "Type": "EntityRenderingConfig",
                                        "Optional": "No",
                                        "Description": "The new rendering configuration for the entity."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "rotate(...directions)",
                                description: "Rotates the entity specific directions.",
                                table: [
                                    {
                                        "Name": "directions",
                                        "Type": "Movement[]",
                                        "Optional": "No",
                                        "Description": "The directions to rotate the entity in."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "move(...directions)",
                                description: "Moves the entity specific directions.",
                                table: [
                                    {
                                        "Name": "directions",
                                        "Type": "Movement[]",
                                        "Optional": "No",
                                        "Description": "The directions to move the entity in."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "update()",
                                returnType: "void",
                                description: "Updates the entity.",
                                table: []
                            },
                            {
                                keyword: "public",
                                name: "updatePosition(vector)",
                                returnType: "void",
                                description: "Updates the position <nerd>and the position of the vertices</nerd> of the entity.",
                                table: [
                                    {
                                        "Name": "vector",
                                        "Type": "Vector",
                                        "Optional": "No",
                                        "Description": "The vector to add to the position of the entity."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "render()",
                                returnType: "void",
                                description: "Renders the entity.",
                                table: []
                            }
                        ]
                    }
                ]
            },
            {
                name: "CollisionResolver",
                link: "/docs/classes/CollisionResolver",
                importStatement: "import { Collision: { CollisionResolver } } from \"kinetics.ts\";",
                exportStatement: "export default class CollisionResolver { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The CollisionResolver class is the class which performs narrowphase collision detection and resolution on entities.",
                    },
                    {
                        name: "Constructor",
                        parameters: "constructor()",
                        table: []
                    },
                    {
                        name: "Properties",
                        data: []
                    },
                    {
                        name: "Methods",
                        data: [
                            {
                                keyword: "public",
                                name: "detect(entity1, entity2)",
                                returnType: "void",
                                description: `Detects collisions between two entities, and automatically resolves them if detected.
                                <nerd>Collision detection occurs by utilizing the Separating Axis Theorem. The separating axis theorem takes </nerd>
                                <nerd>advantage of the fact that if two polygons are separated, there exists a separating axis that separates the two polygons. </nerd>
                                <nerd>However, if two polygons are not separated, there exists no separating axis that separates the two polygons. </nerd>
                                <nerd>The easiest way to think of this is by imagining the shadows of two entities. If the shadows are not separated, </nerd>
                                <nerd>then the entities are not separated. If the shadows are separated, then the entities are separated. </nerd>
                                <nerd>Therefore, the separating axis theorem projects the vertices of the two entities onto a set of axes, and checks </nerd>
                                <nerd>if the projections overlap. If the projections overlap, then the entities are not separated, and if the projections </nerd>
                                <nerd>do not overlap, then the entities are separated.</nerd>
                                `,
                                table: [
                                    {
                                        "Name": "entity1",
                                        "Type": "Entity",
                                        "Optional": "No",
                                        "Description": "The first entity to check for collisions."
                                    },
                                    {
                                        "Name": "entity2",
                                        "Type": "Entity",
                                        "Optional": "No",
                                        "Description": "The second entity to check for collisions."
                                    }
                                ],
                                latex: [SAT2, SAT]
                            },
                            {
                                keyword: "public",
                                name: "resolve(entity1, entity2, elasticity, overlap, axis)",
                                returnType: "void",
                                description: `Resolves collisions between two entities.
                                <nerd>Collision resolution occurs by utilizing Minimum Translation Vectors.</nerd>
                                <nerd>Minimum Translation Vectors are the smallest vector that can be added to an entity to separate it from another entity.</nerd>
                                <nerd>The overlap of the two entities is calculated by the amount of overlap between the projections of the two entities onto a given axis.</nerd>
                                <nerd>The overlap is then used to calculate the minimum translation vector, which is then added to the entities to separate them.</nerd>
                                <nerd>The elasticity of the collision is also used to calculate the impulse, which is then used to change the velocities of the entities.</nerd>
                                <nerd>The angular velocities of the entities are also changed by the impulse and the entities respective inertias.</nerd>
                                `,
                                table: [
                                    {
                                        "Name": "entity1",
                                        "Type": "Entity",
                                        "Optional": "No",
                                        "Description": "The first entity to resolve collisions for."
                                    },
                                    {
                                        "Name": "entity2",
                                        "Type": "Entity",
                                        "Optional": "No",
                                        "Description": "The second entity to resolve collisions for."
                                    },
                                    {
                                        "Name": "elasticity",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The elasticity of the collision."
                                    },
                                    {
                                        "Name": "overlap",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The amount of overlap between the two entities."
                                    },
                                    {
                                        "Name": "axis",
                                        "Type": "Vector",
                                        "Optional": "No",
                                        "Description": "The axis the vertices were projected onto in the `detect()` function."
                                    }
                                ],
                                latex: [CI, CAV, CP]
                            }
                        ]
                    }
                ]
            },
            {
                name: "SpatialHashGrid",
                link: "/docs/classes/SpatialHashGrid",
                importStatement: "import { Collision: { SpatialHashGrid } } from \"kinetics.ts\";",
                exportStatement: "export default class SpatialHashGrid implements CollisionManager { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The SpatialHashGrid class is the class which partitions the system into a grid for efficient broadphase collision detection. This class implements the CollisionManager type. <nerd>Spatial hash grids are a data structure used for efficient broad-phase collision detection by dividing the system into a grid, where each grid cell contains references to the objects that intersect or are close to the cell, allowing for faster proximity queries and reducing the number of pairwise checks required.</nerd>",
                    },
                    {
                        name: "Constructor",
                        parameters: "constructor(system, cellSize)",
                        table: [
                            {
                                "Name": "system",
                                "Type": "System",
                                "Optional": "No",
                                "Description": "The system to partition."
                            },
                            {
                                "Name": "cellSize",
                                "Type": "number",
                                "Optional": "No",
                                "Description": "The size of each cell in the grid."
                           }
                        ]
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "system",
                                returnType: "System",
                                description: "The system to partition.",
                            },
                            {
                                keyword: "public",
                                name: "cellSize",
                                returnType: "number",
                                description: "The size of each cell in the grid.",
                            }
                        ]
                    },
                    {
                        name: "Methods",
                        data: [
                            {
                                keyword: "public",
                                name: "insert(x, y, w, h, id)",
                                returnType: "void",
                                description: "Inserts an entity into the grid.",
                                table: [
                                    {
                                        "Name": "x",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The x position of the entity."
                                    },
                                    {
                                        "Name": "y",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The y position of the entity."
                                    },
                                    {
                                        "Name": "w",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The width of the entity."
                                    },
                                    {
                                        "Name": "h",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The height of the entity."
                                    },
                                    {
                                        "Name": "id",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The id of the entity."
                                    }
                                ],
                            },
                            {
                                keyword: "public",
                                name: "query()",
                                returnType: "void",
                                description: "Queries the grid by iterating over every cell and performing narrowphase detection on each entity pair.",
                                table: []
                            },
                            {
                                keyword: "public",
                                name: "clear()",
                                returnType: "void",
                                description: "Clears the grid.",
                                table: []
                            }
                        ]
                    }
                ]
            },
            {
                name: "Camera",
                link: "/docs/classes/camera",
                importStatement: "import { Utils: { Camera } } from \"kinetics.ts\";",
                exportStatement: "export default class Camera { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The Camera class is the class which renders the system onto a canvas.",
                    },
                    {
                        name: "Constructor",    
                        parameters: "constructor(config, system)",
                        table: [
                            {
                                "Name": "config",
                                "Type": "CameraConfig",
                                "Optional": "No",
                                "Description": "The configuration object for the camera."
                            },
                            {
                                "Name": "system",
                                "Type": "System",
                                "Optional": "No",
                                "Description": "The system the camera is viewing."
                            }
                        ],
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "system",
                                returnType: "System",
                                description: "The system the camera is viewing.",
                            },
                            {
                                keyword: "public",
                                name: "position",
                                returnType: "Vector",
                                description: "The position of the camera.",
                            },
                            {
                                keyword: "public",
                                name: "zoom",
                                returnType: "number",
                                description: "The measure of how zoomed out the camera is.",
                            }
                        ]
                    },
                    {
                        name: "Methods",
                        data: [
                            {
                                keyword: "public",
                                name: "setCenter(position)",
                                returnType: "void",
                                description: "Sets the center of the camera.",
                                table: [
                                    {
                                        "Name": "position",
                                        "Type": "VectorLike",
                                        "Optional": "No",
                                        "Description": "The position to set the center of the camera to."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "getSystemCoordinates(clientCoordinates)",
                                returnType: "Vector",
                                description: "Gets the system coordinates mapped by the client coordinates.", 
                                table: [
                                    {
                                        "Name": "clientCoordinates",
                                        "Type": "VectorLike",
                                        "Optional": "No",
                                        "Description": "The client coordinates to map to system coordinates."
                                    } 
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "Renderer",
                link: "/docs/classes/renderer",
                importStatement: "import { Utils: { Renderer } } from \"kinetics.ts\";",
                exportStatement: "export default class Renderer { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The Renderer class is the class which renders the system onto a canvas using CanvasRenderingContext2D.",
                    },
                    {
                        name: "Constructor",
                        parameters: "constructor(config, system)",
                        table: [
                            {
                                "Name": "config",
                                "Type": "SystemRenderingConfig",
                                "Optional": "No",
                                "Description": "The configuration object for the renderer."
                            },
                            {
                                "Name": "system",
                                "Type": "System",
                                "Optional": "No",
                                "Description": "The system the renderer is rendering."
                            }
                        ],
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "system",
                                returnType: "System",
                                description: "The system the renderer is rendering.",
                            },
                            {
                                keyword: "public",
                                name: "canvas",
                                returnType: "HTMLCanvasElement",
                                description: "The canvas the renderer is rendering onto.",
                            },
                            {
                                keyword: "public",
                                name: "context",
                                returnType: "CanvasRenderingContext2D",
                                description: "The context of the canvas the renderer is rendering onto.",
                            },
                            {
                                keyword: "public",
                                name: "rendering",
                                returnType: "SystemRenderingConfig",
                                description: "The rendering configuration of the renderer.",
                            },
                            {
                                keyword: "public",
                                name: "framerate",
                                returnType: "{ fpsArr: number[], fps: number, dt: number, lastUpdate: number }",
                                description: "The framerate information of the renderer. `fpsArr` is a list of the last 30 recorded framerates, `fps` is the average framerate, `dt` is the time elapsed since the last frame, and `lastUpdate` is the time of the last frame."
                            }
                        ]
                    },
                    {
                        name: "Methods",
                        data: [
                            {
                                keyword: "public",
                                name: "configure(config)",
                                returnType: "void",
                                description: "Reconfigures the rendering options for the renderer.",
                                table: [
                                    {
                                        "Name": "config",
                                        "Type": "SystemRenderingConfig",
                                        "Optional": "No",
                                        "Description": "The new rendering configuration for the renderer."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "render()",
                                returnType: "void",
                                description: "Renders the system. Automatically calls itself again in an infinite loop.",
                                table: []
                            }
                        ]
                    }
                ]
            },
            {
                name: "Vector",
                link: "/docs/classes/vector",
                importStatement: "import { Utils: { { Vector, VectorLike } } } from \"kinetics.ts\";",
                exportStatement: "export class Vector implements VectorLike { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The Vector class is the class which represents a vector in 2D space, simulataneously representing direction and magnitude. It can also be used as a tuple.",
                    },
                    {
                        name: "Constructor",
                        parameters: "constructor(x, y)",
                        table: [
                            {
                                "Name": "x",
                                "Type": "number",
                                "Optional": "No",
                                "Description": "The x component of the vector."
                            },
                            {
                                "Name": "y",
                                "Type": "number",
                                "Optional": "No",
                                "Description": "The y component of the vector."
                            },
                        ]
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "x",
                                returnType: "number",
                                description: "The x component of the vector.",
                            },
                            {
                                keyword: "public",
                                name: "y",
                                returnType: "number",
                                description: "The y component of the vector."
                            },
                            {
                                keyword: "public",
                                name: "magnitudeSq",
                                returnType: "number",
                                description: "The square of the magnitude of the vector.",
                            },
                            {
                                keyword: "public",
                                name: "magnitude",
                                returnType: "number",
                                description: "The magnitude of the vector.",
                            },
                            {
                                keyword: "public",
                                name: "clone",
                                returnType: "Vector",
                                description: "A getter which returns a clone of the vector.",
                            },
                            {
                                keyword: "public",
                                name: "orthogonal",
                                returnType: "Vector",
                                description: "A getter which returns the orthogonal vector of the current vector. <nerd>Calculated by reflecting the vector over the line y = -x.</nerd>",
                                latex: [VN]
                            },
                        ]
                    },
                    {
                        name: "Methods",
                        data: [
                            {
                                keyword: "public",
                                name: "add(vector)",
                                returnType: "Vector",
                                description: "Modifies the current vector by adding it to the vector provided.",
                                table: [
                                    {
                                        "Name": "vector",
                                        "Type": "VectorLike",
                                        "Optional": "No",
                                        "Description": "The vector to add to the vector."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "subtract(vector)",
                                returnType: "Vector",
                                description: "Modifies the current vector by subtracting it from the vector provided.",
                                table: [
                                    {
                                        "Name": "vector",
                                        "Type": "VectorLike",
                                        "Optional": "No",
                                        "Description": "The vector to subtract from the vector."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "scale(scalar)",
                                returnType: "Vector",
                                description: "Modifies the current vector by scaling it by the scalar provided.",
                                table: [
                                    {
                                        "Name": "scalar",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The scalar to scale the vector by."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "normalize()",
                                returnType: "Vector",
                                description: "Normalizes the current vector by setting its magnitude to 1.",
                                table: []
                            },
                            {
                                keyword: "public",
                                name: "distance(vector)",
                                returnType: "number",
                                description: "Returns the distance between the current vector and the vector provided. <nerd>Calculated by getting the magnitude of the two vectors subtracted from eachother.</nerd>",
                                table: [
                                    {
                                        "Name": "vector",
                                        "Type": "Vector",
                                        "Optional": "No",
                                        "Description": "The vector to get the distance from."
                                    }
                                ],
                                latex: [VD]
                            },
                            {
                                keyword: "public",
                                name: "dot(vector)",
                                returnType: "number",
                                description: "Returns the dot product of the current vector and the vector provided.",
                                table: [
                                    {
                                        "Name": "vector",
                                        "Type": "VectorLike",
                                        "Optional": "No",
                                        "Description": "The vector to compute the dot product with."
                                    }
                                ],
                                latex: [DOT]
                            },
                            {
                                keyword: "public",
                                name: "cross(vector)",
                                returnType: "number",
                                description: "Returns the cross product of the current vector and the vector provided. <nerd>Real cross products may only be computed in three-dimensional spaces. Cross products in 2D function by implictly assuming the z-axis values are 0. A nicer way to represent it is the determinant of a 2x2 square matrix. The sign of the determinant represents the orientation of the 2nd vector in comparison to the 1st (clockwise/counterclockwise), while the magnitude represents the area of the parallelogram formed by the two vectors.</nerd>",
                                table: [
                                    {
                                        "Name": "vector",
                                        "Type": "VectorLike",
                                        "Optional": "No",
                                        "Description": "The vector to compute the cross product with."
                                    }
                                ],
                                latex: [VC1, VC2, VC3]
                            },
                            {
                                keyword: "public",
                                name: "project(vector)",
                                returnType: "Vector",
                                description: "Returns the projection of the current vector onto the vector provided. <nerd>Calculates the proportion of the initial vector in proportion to the provided vector, and scales the initial vector to map the initial vector onto the provided vector.</nerd>",
                                table: [
                                    {
                                        "Name": "vector",
                                        "Type": "VectorLike",
                                        "Optional": "No",
                                        "Description": "The vector to project the current vector onto."
                                    }
                                ],
                                latex: [VP]
                            },
                            {
                                keyword: "public",
                                name: "angle(vector)",
                                returnType: "number",
                                description: "Returns the angle between the current vector and the vector provided. <nerd>Calculated by taking the arctan2 of the distance between the x and y components of the initial vector and provided vector.</nerd>",
                                table: [
                                    {
                                        "Name": "vector",
                                        "Type": "VectorLike",
                                        "Optional": "Yes",
                                        "Description": "The vector to get the angle from. If not provided, the angle between formed by the vector and the origin is returned."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "direction(angle)",
                                returnType: "Vector",
                                description: "Changes the vector's direction while preserving length to equal the angle provided.",
                                table: [
                                    {
                                        "Name": "angle",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The angle to set the vector to, in radians."
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Typings",
        children: [
            {
                name: "CameraConfig",
                link: "/docs/typings/CameraConfig",
                type: "interface",
                importStatement: "import { Interfaces: { CameraConfig } } from \"kinetics.ts\";",
                exportStatement: "export interface CameraConfig { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The CameraConfig interface is the interface which represents the configuration object for the Camera class.",
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "position",
                                returnType: "Vector",
                                defaultsTo: "new Vector(0, 0)",
                                description: "The position of the camera.",
                            },
                            {
                                keyword: "public",
                                name: "zoom",
                                returnType: "number",
                                defaultsTo: "1",
                                description: "The measure of how zoomed out the camera is.",
                            }
                        ]
                    }
                ]
            },
            {
                name: "SystemRenderingConfig",
                link: "/docs/typings/SystemRenderingConfig",
                type: "interface",
                importStatement: "import { Interfaces: { SystemRenderingConfig } } from \"kinetics.ts\";",
                exportStatement: "export interface SystemRenderingConfig { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The SystemRenderingConfig interface is the interface which represents the configuration object for the Renderer class.",
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "canvas",
                                returnType: "HTMLCanvasElement",
                                description: "The canvas the renderer is rendering onto.",
                            },
                            {
                                keyword: "public",
                                name: "background",
                                returnType: "string",
                                defaultsTo: "Colors.White",
                                description: "The background color of the canvas.",
                            },
                            {
                                keyword: "public",
                                name: "gridColor",
                                returnType: "string",
                                defaultsTo: "Colors.Black",
                                description: "The color of the grid lines.",
                            },
                            {
                                keyword: "public",
                                name: "gridSize",
                                returnType: "number",
                                description: "The length of one side of the grid squares. If not provided, the grid will not be rendered.",
                            },
                            {
                                keyword: "public",
                                name: "gridWidth",
                                returnType: "number",
                                defaultsTo: "1",
                                description: "The width of the grid lines.",
                            },
                            {
                                keyword: "public",
                                name: "hooks",
                                returnType: "{ preRender: (context: CanvasRenderingContext2D) => void, postRender: (context: CanvasRenderingContext2D) => void }",
                                description: "The hooks for the renderer. `preRender` is called before the system is rendered, and `postRender` is called after the system is rendered.",
                            }
                        ]
                    }
                ]
            },
            {
                name: "EntityRenderingConfig",
                link: "/docs/typings/EntityRenderingConfig",
                type: "interface",
                importStatement: "import { Interfaces: { EntityRenderingConfig } } from \"kinetics.ts\";",
                exportStatement: "export interface EntityRenderingConfig { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The EntityRenderingConfig interface is the interface which represents the rendering configuration object for the Entity class.",
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "strokeColor",
                                returnType: "Colors | string",
                                description: "The color of the entity's stroke. If not provided, there will be no stroke. If there is no fill color either, the stroke will default to `Colors.Black`.",
                            },
                            {
                                keyword: "public",
                                name: "fillColor",
                                returnType: "Colors | string",
                                description: "The color of the entity's fill. If not provided, there will be no fill. If there is no stroke color either, the fill will default to `Colors.Black`.",
                            },
                            {
                                keyword: "public",
                                name: "strokeWidth",
                                returnType: "number",
                                defaultsTo: "1",
                                description: "The width of the entity's stroke.",
                            },
                            {
                                keyword: "public",
                                name: "glowIntensity",
                                returnType: "number",
                                description: "The intensity of the entity's glow. If not specified, there will be no glow."
                            },
                            {
                                keyword: "public",
                                name: "glowColor",
                                returnType: "Colors | string",
                                description: "The color of the entity's glow. If not specified, the glow will default to its stroke."
                            },
                            {
                                keyword: "public",
                                name: "hooks",
                                returnType: "{ preRender: (context: CanvasRenderingContext2D) => void, postRender: (context: CanvasRenderingContext2D) => void }",
                                description: "The hooks for the renderer. `preRender` is called before the entity is rendered, and `postRender` is called after the entity is rendered.",
                            }
                        ]
                    }
                ]
            },
            {
                name: "SystemConfig",
                link: "/docs/typings/SystemConfig",
                type: "interface",
                importStatement: "import { Interfaces: { SystemConfig } } from \"kinetics.ts\";",
                exportStatement: "export interface SystemConfig { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The SystemConfig interface is the interface which represents the configuration object for the System class.",
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "collisionInfo",
                                returnType: "{ cellSize: number }",
                                description: "The collision information for the system. `cellSize` is the size of each cell in the spatial hashgrid.",
                            },
                            {
                                keyword: "public",
                                name: "tickRate",
                                returnType: "number",
                                defaultsTo: "60",
                                description: "The tick rate of the system, in FPS.",
                            },
                            {
                                keyword: "public",
                                name: "verbose",
                                returnType: "boolean",
                                defaultsTo: "false",
                                description: "Whether or not the system should log information to the console.",
                            },
                            {
                                keyword: "public",
                                name: "useRAF",
                                returnType: "boolean",
                                defaultsTo: "true",
                                description: "Whether or not the system should use `requestAnimationFrame`.",
                            },
                            {
                                keyword: "public",
                                name: "friction",
                                returnType: "number",
                                defaultsTo: "0.1",
                                description: "The friction of the system.",
                            },
                            {
                                keyword: "public",
                                name: "gravity",
                                returnType: "number",
                                defaultsTo: "0",
                                description: "The gravity of the system.",
                            },
                            {
                                keyword: "public",
                                name: "camera",
                                returnType: "CameraConfig",
                                description: "The configuration object for the camera.",
                            },
                            {
                                keyword: "public",
                                name: "render",
                                returnType: "SystemRenderingConfig",
                                description: "The configuration object for the renderer."
                            }
                        ],
                    }
                ]
            },
            {
                name: "EntityConfig",
                children: [{
                    name: "CircleConfig",
                    link: "/docs/typings/CircleConfig",
                    type: "interface",
                    importStatement: "import { Interfaces: { CircleConfig } } from \"kinetics.ts\";",
                    exportStatement: "export interface CircleConfig extends EntityConfig { ... }",
                    data: [
                        {
                            name: "Summary",
                            description: "The CircleConfig interface is the interface which represents the configuration information of a circle. It extends off of the EntityInfo interface.",
                        },
                        {
                            name: "Properties",
                            data: [
                                {
                                    keyword: "public",
                                    name: "radius",
                                    returnType: "number",
                                    description: "The radius of the circle.",
                                }
                            ]
                        }
                    ]
                }],
                link: "/docs/typings/EntityConfig",
                type: "interface",
                importStatement: "import { Interfaces: { EntityConfig } } from \"kinetics.ts\";",
                exportStatement: "export interface EntityConfig { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The EntityInfo interface is the interface which represents the configuration information of an entity.",
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "form",
                                returnType: "EntityForm",
                                description: "The form of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "speed",
                                returnType: "number",
                                description: "The speed of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "mass",
                                returnType: "number",
                                description: "The mass of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "elasticity",
                                returnType: "number",
                                description: "The elasticity of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "static",
                                returnType: "boolean",
                                defaultsTo: "false",
                                description: "Whether or not the entity is static.",
                            },
                            {
                                keyword: "public",
                                name: "angularSpeed",
                                returnType: "number",
                                description: "The angular speed of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "rotate",
                                returnType: "boolean",
                                defaultsTo: "true",
                                description: "Whether or not the entity should rotate.",
                            },
                            {
                                keyword: "public",
                                name: "sleepThreshold",
                                returnType: "number",
                                defaultsTo: "-1",
                                description: "The value both the linear and angular velocity of this entity must be below to qualify for sleeping. If not provided, the entity will never go to sleep.",
                            },
                            {
                                keyword: "public",
                                name: "render",
                                returnType: "EntityRenderingConfig",
                                description: "The rendering configuration of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "hooks",
                                returnType: "{ preResolve: (entity: Entity) => void, postResolve: (entity: Entity) => void }",
                                description: "The hooks for a collision between itself and another entity. `preResolve` is called before the entities collide, and `postResolve` is called after the entities collide.",
                            }
                        ]
                    }
                ]
            },
            {
                name: "EntityForm",
                link: "/docs/typings/EntityForm",
                type: "interface",
                importStatement: "import { Interfaces: { EntityForm } } from \"kinetics.ts\";",
                exportStatement: "export interface EntityForm { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The EntityForm interface is the interface which represents the form of an entity.",
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "sides",
                                returnType: "number",
                                description: "The number of sides of the entity. This is used in conjunction with the `radius`, `rotation`, and `offset` properties to calculate the vertices of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "radius",
                                returnType: "number",
                                description: "The radius of the entity. This is used in conjunction with the `sides`, `rotation`, and `offset` properties to calculate the vertices of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "rotation",
                                returnType: "number",
                                description: "The rotation of the entity, in radians. This is used in conjunction with the `sides`, `radius`, and `offset` properties to calculate the vertices of the entity.",
                            },
                            {
                                keyword: "public",
                                name: "offset",
                                returnType: "VectorLike",
                                description: "The offset of the entity. This is used in conjunction with the `sides`, `radius`, and `rotation` properties to calculate the vertices of the entity.",
                            },

                            {
                                keyword: "public",
                                name: "vertices",
                                returnType: "Vector[]",
                                description: "The vertices of the entity. This is unable to be used in conjunction with the other properties.",
                            },

                            {
                                keyword: "public",
                                name: "components",
                                returnType: "(EntityConfig | CircleConfig)[]",
                                description: "The components of the entity. This is unable to be used in conjunction with the other properties.",
                            }
                        ]
                    }
                ]
            },
            {
                name: "CollisionManager",
                link: "/docs/typings/CollisionManager",
                type: "interface",
                importStatement: "import { Interfaces: { CollisionManager } } from \"kinetics.ts\";",
                exportStatement: "export interface CollisionManager { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The CollisionManager interface is the interface which represents the collision manager for the system.",
                    },
                    {
                        name: "Methods",
                        data: [
                            {
                                keyword: "public",
                                name: "insert(x, y, w, h, id)",
                                returnType: "void",
                                description: "Inserts an entity into the grid.",
                                table: [
                                    {
                                        "Name": "x",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The x position of the entity."
                                    },
                                    {
                                        "Name": "y",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The y position of the entity."
                                    },
                                    {
                                        "Name": "w",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The width of the entity."
                                    },
                                    {
                                        "Name": "h",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The height of the entity."
                                    },
                                    {
                                        "Name": "id",
                                        "Type": "number",
                                        "Optional": "No",
                                        "Description": "The id of the entity."
                                    }
                                ]
                            },
                            {
                                keyword: "public",
                                name: "query()",
                                returnType: "void",
                                description: "Queries the grid by iterating over every cell and performing narrowphase detection on each entity pair.",
                                table: []
                            },
                            {
                                keyword: "public",
                                name: "clear()",
                                returnType: "void",
                                description: "Clears the grid.",
                            }
                        ]
                    }
                ]
            },
            {
                name: "VectorLike",
                link: "/docs/typings/VectorLike",
                type: "interface",
                importStatement: "import { Interfaces: { VectorLike } } from \"kinetics.ts\";",
                exportStatement: "export interface VectorLike { ... }",
                data: [
                    {
                        name: "Summary",
                        description: "The VectorLike interface is the interface which represents an object which can be used as a vector.",
                    },
                    {
                        name: "Properties",
                        data: [
                            {
                                keyword: "public",
                                name: "x",
                                returnType: "number",
                                description: "The x component of the vector.",   
                            },
                            {
                                keyword: "public",
                                name: "y",
                                returnType: "number",
                                description: "The y component of the vector.",
                            }
                        ]
                    }
                ]
            },
            {
                name: "Movement",
                link: "/docs/typings/movement",
                type: "enum",
                importStatement: "import { Enums: { Movement } } from \"kinetics.ts\";",
                exportStatement: `
export enum Movement {
    Up, 
    Down,
    Left,
    Right
};`,
                data: [{
                    name: "Summary",
                    description: "The Movement enum is the enum which represents the direction of movement (for linear and angular motion).",
                }]
            },
            {
                name: "Environment",
                link: "/docs/typings/environment",
                type: "enum",
                importStatement: "import { Enums: { Environment } } from \"kinetics.ts\";",
                exportStatement: `
export enum Environment {
    Browser,
    Node
};
                `,
                data: [{
                    name: "Summary",
                    description: "The Environment enum is the enum which represents the environment the library is running in.",
                }]
            },
            {
                name: "EntityType",
                link: "/docs/typings/EntityType",
                type: "enum",
                importStatement: "import { Enums: { EntityType } } from \"kinetics.ts\";",
                exportStatement: `
export enum EntityType {
    Polygon,
    Circle    
};
                `,
                data: [{
                    name: "Summary",
                    description: "The EntityType enum is the enum which represents the type of an entity.",
                }]
            },
            {
                name: "Colors",
                link: "/docs/typings/colors",
                type: "enum",
                importStatement: "import { Enums: { Colors } } from \"kinetics.ts\";",
                exportStatement: `
export enum Colors {
    Pink         = "#F177DD",
    LightRed     = "#FC7677",
    Red          = "#F14E54",
    Yellow       = "#FFE869",
    Peach        = "#FCC376",
    Orange       = "#FFA500",
    Green        = "#00E16E",
    BrightGreen  = "#43FF91",
    NeonGreen    = "#8AFF69",
    Blue         = "#00B2E1",
    DarkBlue     = "#768DFC",
    Purple       = "#BF7FF5",
    Gray         = "#C0C0C0",
    Black        = "#000000",
    White        = "#FFFFFF"
};
                `,
                data: [{
                    name: "Summary",
                    description: "The Colors enum is the enum which represents inbuilt colors for easy access. Raw hex codes may also be provided in place of values which take a `Colors | string` type.",
                }]                
            },
        ]
    }
];