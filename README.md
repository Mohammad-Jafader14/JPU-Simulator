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

## Roadmap

### Alpha
- Core CPU simulation
- ROM programmer
- Dashboard
- Documentation
- Import / Export
- Local saving

### Beta
- Configurable CPU architecture
- Interrupt Controller
- GPU
- Assembler
- Better debugging tools
- Additional example programs

### Future
- Complete architecture customization
- Project files
- Cloud saves
- User accounts
- Community sharing
- Plugins and extensions

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