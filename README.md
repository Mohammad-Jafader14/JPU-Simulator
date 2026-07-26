# JPU

**JPU** is a customizable CPU simulator built for learning, experimentation, and designing your own computer architectures.

The current Alpha release focuses on providing a complete CPU simulation environment with a ROM programmer, live execution dashboard, memory inspection tools, and an expandable architecture that will become increasingly customizable throughout future releases.

---

## Features

### CPU Simulation

- Instruction execution
- Arithmetic Logic Unit (ALU)
- 64 General Purpose Registers
- Two RAM banks
- Call Stack
- Status Flags
- Program Counter
- Control Unit
- Conditional execution
- CALL / RET instructions
- HALT instruction

### ROM Programmer

- Visual instruction editor
- 256 ROM instruction slots
- Import `.jpur` files
- Export `.jpur` files
- Built-in example programs
- Local browser saving

### Dashboard

- Run
- Pause
- Step
- Back
- Reset
- Adjustable clock speed
- Live register viewer
- Live RAM viewer
- Live stack viewer
- Live flag viewer
- Current instruction display
- Control signal viewer
- ALU monitor

### Interface

- Responsive design
- Light & Dark mode
- Number format selection
- Documentation
- Settings page
- Browser-local preferences

---

## Philosophy

JPU is **not** intended to simulate one fixed processor forever.

The long-term goal is to allow users to build and experiment with their own CPU architectures by customizing hardware characteristics such as:

- Register count
- Memory size
- ROM size
- Stack size
- Word size
- Instruction sets
- Interrupt systems
- Graphics hardware
- And much more

The current Alpha lays the foundation for that vision.

---

## File Formats

### `.jpur`

Stores ROM programs.

Future versions will introduce additional formats for complete CPU projects and configurations.

---

### Versioning

JPU follows a staged release cycle designed to keep experimental work separate from stable public releases.

#### Release Stages

| Stage     | Versions          |
| --------- | ----------------- |
| Pre-Alpha | `0.0.1` → `0.0.9` |
| Alpha     | `0.1.0` → `0.3.9` |
| Beta      | `0.4.0` → `0.9.9` |
| Release   | `1.0.0` → `...`   |

---

#### Patch Versions

JPU uses semantic versioning in the form:

`A.B.C`

- **A** – Major release.
- **B** – Feature release.
- **C** – Patch/internal revision.

Patch versions are frequently created during development to fix bugs, test ideas, or prepare the next public release.

Because of this, **not every patch version is published**.

For example, you may see:

```
0.1.4
0.1.6
```

without a public `0.1.5`.

This is intentional. Missing versions are usually internal development builds, abandoned experiments, or bug-fix revisions that were never released.

---

#### Older Versions

Every public release is archived using Git tags, allowing previous versions of the simulator to remain accessible even after newer releases are published.

Future versions of the simulator may also include an in-browser version selector, allowing users to easily switch between supported releases without downloading the source code.

---

#### Branches

The repository keeps development organised by release stage.

- `main` — Current public version.
- Feature branches — Used while developing new functionality.
- Temporary branches — Used for experiments and merged or deleted when finished.

Older public releases are preserved using **Git tags**, not separate long-term branches.

---

#### Notes

- Not every version created during development becomes a public release.
- Public release notes begin with **Pre-Alpha v0.0.9**, the first version published online.
- Internal builds may exist that were never uploaded or announced.

---

### Roadmap

#### Alpha

- Core CPU simulation
- ROM Editor
- Dashboard
- Documentation
- Test Suite
- Import / Export
- Local saving
- Settings
- Release notes

#### Beta

- Configurable CPU architecture
- Interrupt Controller
- I/O Devices
- GPU
- Assembler
- Better debugging tools
- Additional example programs
- Version selector

#### Future

- Complete architecture customization
- Project files
- Cloud saves
- User accounts
- Community sharing
- Plugins & extensions
- Custom peripherals
- Web API

---

## Built With

- HTML
- CSS
- Tailwind CSS
- JavaScript (ES Modules)

---

## License

This project is licensed under the MIT License.

---

JPU is an educational project designed to help developers, students, hobbyists, and computer architecture enthusiasts understand how CPUs work while providing a foundation for building entirely custom processor designs.
