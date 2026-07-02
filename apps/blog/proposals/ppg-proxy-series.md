# ppg-proxy blogposts

A proposal for a series of blogposts showing how we manage prisma postgres connectivity, discussing about the ppg-proxy, what problems it resolves, how it evolved, the challenges whe faced over time, and the revamp that we've been doing as a result.


# 1 ppg-proxy intro: what, why and how

1. What is Prisma Postgres, how/where it's deployed, what are the common access pattern to postgres in multi tenant settings (very briefly, we talked about microvms/unikernels extensively already)
2. justifying the need for a "proxy" or "gateway": what responsibilities it takes:
    - route postgres traffic to the target databases, preserving tenant isolation
    - better auth scheme, api-key based, rotation without touching db credentials
    - billing & holds based on queries, ingress/egress traffic, backup traffic, etc
    - unified throttling, observability, access logging
3. Chanllenges and how we overcome them
    - the routing data distribution: choices and tradeoffs
    - The postgres binary protocol (message-oriented) and the open source libraries landscape
    - buffering and the noisy neighbor problem: when horizontal scaling hides but doesn't solve the problem
    - biting the bullet and implementing a full end-to-end low level streaming protocol capability, while still allowing selective messages inspection (e.g. error reporting or query counting)
4. What's next
    - the need for a more serverless-friendly entry point
    - per-tenant dedicated connection pooling

# 2 ppg-proxy for serverless - part 1: Connection Pooling

1. What are serverless workloads, how they compare to traditional stateful workloads, why they are convenient from a developer perspective, what are their limitations
    - introducing stateless execution environment (e.g. aws Lambda) vs a traditional VM/bare metal server solution
    - dissonance between serverless environment and "legacy" technologies such as RDBMs and their long-running persistent connection & transaction model, normally adopted in _persistent_ running environments such as ec2
    - lack of support for native tcp/tls client connectivity (sometimes)
    - possible approaches to bridge the gap: dedicated pooler, http/ws protocol wrapper, or pooler-as-a-service (accelerate, which does both things with its limitations)
2. Tackling the throwaway-connection issue with pooling
    - what's connection pooling, what's its main goal (to relieve pressure on the db for connection creation/teardown)
    - what are the pooling types/levels (statement, transaction, connection) 
    - how each approach "reuses" connections (at a high level, query-start-query-end boundaries, transaction detection)
    - how Prisma Postgres approached the problem (per-db pgbouncer), what are the current limitations when used in conjunction with ppg proxy
3. What's next
    - Anticipating part 2: not all environments support direct TCP/TLS
    - How a http/ws API could fill the gap (exploring 2 approaches, pg-protocol wrapper and its limitations vs a bespoke api, without anticipating too much)


# 2 ppg-proxy for serverless - part 2: HTTP/WS API & driver

1. Where we left: tackling the lack of support for tcp/tls and the need of a HTTP-friendly alternative.
    - How the industry usually handles this: bare-metal pg protocol wrapper vs bespoke HTTP/WS API.
    - The _"driver"_ is not the challenge, the API is: Neon serverless driver as a case study, a deep dive in its protocol mechanics
    - how Neon approach represents a _blast from the past_ for us (QE anyone?) and why it's a poor/short-sighted model. Lessons learned with Data Proxy & Accelerate (noisy neighbor problem, artificially limiting query duration and req/res body size to manage scaling)
2. Prisma Postgres Serverless API
    - How we overcame the limitations of a Neon-serverless-driver/Accelerate QE model: biting the bullet and implementing a full end-to-end streaming mechanism: basic idea
    - The full end-to-end streaming chain: ingress layer, encoding/decoding, framing layer & flow control, database session & sub-message level streaming
3. Prisma Postgres Serverless Driver
    - Unlocking the same flexibility on the client side: streaming as a _first class citizen_, although optional: CollectableIterator
    - Advanced features unlocked _for free_: postgres query batching and pipelining, the difference with the traditional request/response model, how this blends seamlessly with the client driver API
    - Future state: a driver for every language! Sketching an example of a JDBC driver.


# 3 ppg-proxy revamped

1. How we got here and why
    - Connection Pooler as a dedicated components: current limitations and the impact on serverless connectivity (pgbouncer as a good _quick win_, but now we have to do it seriously). 
    - What is needed to _embed_ pooling within the ppg-proxy. Clean/busy/dirty connection state & transaction tracking, pg protocol-related challenges: we need a centralized protocol handler for these.
    - The big blocker. Postgres TCP proxy (raw pg protocol) vs serverless HTTP/WS API: two sub-systems, two (almost) independent stories and timelines, EA/GA phases and architectural dissonances: the toll of a fast paced evolution: missing or duplicated building blocks, challenges/risks and opportunities with AI-accelerated re-architecting
2. Towards a unified pipelining model for TCP & Serverless
    - Connection lifecycle and protocol handling are separate problems, and how this helps shaping the new architecture.
    - The BIG challenge: finding the boundary contract between the two, _while_ keeping the streaming promise.
    - Step 1: Unifying wire protocol handling: from a mixed pgproto3/bespoke set of utilities to a well designed, cohesive raw pg protocol library with first-class streaming support.
    - Step 2: The core pg-protocol pipeline
    - Step 3: Serverless API & TCP terminal adapters
3. What's next
    - Connection Pooling as a 2-facet system: the protocol sensing and the connection factory
    - The plan to support advanced pooling features (first we do query detection, transaction boundary and then detecting unsupported statement as the last thing)
