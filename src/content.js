export const contact = {
  email: 'graysen@graysengould.com',
  linkedin: 'linkedin.com/in/graysengould',
  github: 'github.com/GraysenGould',
}

export const education = {
  school: 'Texas Tech University — Honors',
  location: 'Lubbock, TX',
  degree: 'Bachelor of Science in Computer Science',
  gpa: '4.0',
  graduation: 'Expected Dec. 2026',
  coursework: {
    Systems: 'Computer Architecture (RISC-V), Assembly Language, Digital Circuits, Compiler Design & Languages',
    Software: 'OOP, Data Structures and Algorithms, Computer Security (M.S.), Intelligent Systems (M.S.)',
    Math: 'Linear Algebra, Statistics for Engineers, Calculus III',
  },
}

export const experience = [
  {
    company: 'NVIDIA',
    location: 'Santa Clara, CA',
    role: 'DevOps Intern — CUDA Math Libraries',
    dates: 'May 2026 – Present',
    bullets: [
      'Designed and built an infrastructure-less data delivery system for 1TB+ of test data, replacing ad-hoc sync pipelines',
      'Wrote a cross-platform Python tool to deliver test data to Windows and Linux platforms on SLURM and Kubernetes',
      'Ensured end-to-end automation for data upload, automated dependency installation for tool, and RClone mounting',
      'Reduced data upload time by roughly 50% after merges to data repository, improving iteration speed',
      'Worked with CUDA Math Library Engineers to align with test data needs for 10+ math libraries',
    ],
  },
  {
    company: 'Texas Tech Data-Intensive Scalable Computing Laboratory',
    location: 'Lubbock, TX',
    role: 'Research Assistant',
    dates: 'Sep. 2025 – May 2026',
    bullets: [
      'Contributed to and maintained 80+ automated C and Bash tests in Linux, ensuring OpenSHMEM v1.6 compliance',
      'Optimized RaiderSTREAM benchmark initialization, reducing overall benchmark startup time by over 50%',
      'Integrated UCC collectives into OpenSHMEM, improving alltoall throughput by 5x compared to internal collectives',
      'Improved OpenSHMEM benchmark implementation, adding features such as warm up routines to enhance test accuracy',
    ],
  },
  {
    company: 'Tyler Technologies',
    location: 'Lubbock, TX',
    role: 'Software Engineering Intern',
    dates: 'May 2025 – Aug. 2025',
    bullets: [
      'Saved 10+ hours per deployment cycle of the Municipal Payment Platform through an automated health-check system',
      'Designed a backend with AWS Lambda and API Gateway, lowering costs 80% over microservices',
      'Reduced project deployment time by 90% using automated CI/CD pipelines with GitHub Actions and Terraform',
      'Enhanced API scalability and response speed by 50% via database query caching using serverless Memcached',
    ],
  },
]

export const skills = {
  Languages: 'C, C++, CUDA, Python, C#, SQL, Bash, JavaScript',
  'Systems & Tools': 'Linux/Unix, Git, AWS, Docker, Terraform, CI/CD',
  'Frameworks & Libraries': 'MPI, OpenMP, MLIR, SLURM, OpenSHMEM',
  'Core Concepts': 'Distributed Systems, Networking, Performance Benchmarks and Optimization',
  'Software Practices': 'RDMA, Systems Debugging, Algorithms & Data Structures, Latency Optimization',
}

export const projects = [
  {
    name: 'Cocktail',
    description: 'Social Platform — Lubbock, Texas',
    dates: 'Oct. 2025',
    bullets: [
      'Led full-stack development of a social platform app using React Native, FastAPI, and PostgreSQL',
      'Architected and containerized backend infrastructure for rapid prototyping and deployment',
      'Drove user acquisition through outreach campaigns, culminating in a live product test event',
      'Pitched to VC partners (Entrepreneurs First) and leveraged agentic AI tools to accelerate feature development',
    ],
  },
]

export const activities = [
  {
    name: 'Winter Invitational Cluster Competition',
    role: '3rd Place',
    dates: 'Jan. 2025 – Mar. 2025',
    bullets: [
      'Competed against 10 teams for 10 weeks on distributed workload and system level optimization challenges',
      'Improved runtime costs for WRF weather simulation by 9% by evaluating AWS EC2 instance types and setups',
      'Parallelized serial simulation in C using MPI and OpenMP, improving runtime by 75%',
      'Automated HPCG benchmark tuning with bash scripts, enabling faster experimentation and iteration',
    ],
  },
  {
    name: 'Google Developer Group TTU',
    role: 'Innovation and Outreach Lead',
    dates: 'Aug. 2024 – Oct. 2025',
    bullets: [
      'Organized technical workshops for 50+ students, expanding access to developer tools and industry practices',
      "Directed sponsorship efforts for West Texas's Largest Hackathon, HackWesTX, securing $16,000+ in funding",
    ],
  },
]
