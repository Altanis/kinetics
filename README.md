<!-- ![image](https://github.com/Altanis/kinetics-ts/assets/38045884/f9985f30-5d88-48bc-89ca-1b917369665f) -->
![image](https://github.com/Altanis/kinetics-ts/blob/main/img/kinetics.jpeg?raw=true)
<sub>Credits to SimplyTav for creating this logo.</sub>

# About
A blazingly fast, simple 2D physics engine for JavaScript and TypeScript, for both frontend and backend applications.

## Features
- System/Entity Architecture Support
- Built-in Canvas2D Renderer
- Fast Narrowphase Collision Detection
- Fast Broadphase Collision Detection
- Fast Collision Resolution
- Collision Callbacks

## Installation

To install this package on a server or a web framework, use the following command:

```bash
npm install kinetics.ts
```

For a vanilla HTML/CSS/JS project, use the following script tag:

```html
<script src="https://cdn.jsdelivr.net/gh/Altanis/kinetics-ts/build/kinetics.min.js" defer></script>
```

and all of the engine's classes will be available under the `Kinetics` namespace (`window.Kinetics.System`, `window.Kinetics.Entity`, etc.).

## Benchmarks
A 1920x1080 rectangular system of 1,000 entities was benchmarked, where each entity had a radius randomly selected between 3 and 13.

System Specifications:
- Apple M2 chip
- 8-core CPU with 4 performance cores and 4 efficiency cores
- 8-core GPU
- 16-core Neural Engine
- 100GB/s memory bandwidth

<img width="870" alt="image" src="https://github.com/Altanis/kinetics-ts/blob/main/img/bench.png?raw=true">

The benchmarks provide evidence of the engine's exceptional speed and performance in comparison to other alternatives.