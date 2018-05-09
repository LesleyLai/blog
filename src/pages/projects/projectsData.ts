interface ProjectData {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly year: string;
  readonly image?: string; // Path to demo image
  readonly github?: URL;
  readonly website?: URL;
  readonly tags?: string;
}

const projects: ProjectData[] = [
  {
    id: "pathtracing",
    name: "Path Tracer",
    desc: [
      "Clipjump is a full fledged clipboard manager for Windows. It relies on the power of keyboard shortcuts and combinations."
    ],
    year: "2018",
    image: "./pathtracing.png",
    github: new URL("https://github.com/LesleyLai/PathTracer"),
    tags: ["c++", "graphics", "raytracing"]
  }
];

export default projects;
