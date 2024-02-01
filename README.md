## DDD
The main reason for this project is to understand and work with the DDD (Domain Drive Desing) concepts in a repository. The goal is to understand better how this should work and how the project can benefit from it.

## What should this simulates?
The project will try to simulate a store where a client can make purchases and through this purchase, the client can receive some rewards into his/her account.

### Key concepts
- Entity: An *entity* serves to identify something that should exist in your system. Don't misunderstand the entity with the entity or schema in your database. An *entity* is a representation of an domain on your system.
- Value objects: It's something that doesn't change, it is immutable. Instead of using primitive values, you create your own and then it needs to self validate so the value is cohesive
- Aggregate: It's when you can have a entity related with an value object.
- Domain services: It's a service stateless and do a specific task.