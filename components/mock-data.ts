export const groups = [
  {
    id: "1",
    courseCode: "22CS3AEFWD",
    title: "Advanced Algorithms Final Prep",
    description: "Dive into DP, greedy, and graph problems. Past papers and strategy.",
    members: 4,
    capacity: 10,
    type: "Exam Prep",
  },
  {
    id: "2",
    courseCode: "EE201",
    title: "Circuits I Weekly",
    description: "Superposition, Thevenin/Norton, transient analysis study jam.",
    members: 6,
    capacity: 8,
    type: "Offline",
  },
  {
    id: "3",
    courseCode: "MATH245",
    title: "Linear Algebra Office Hours",
    description: "Matrices, eigen-things, proofs, and lots of examples.",
    members: 3,
    capacity: 10,
    type: "Online",
  },
  {
    id: "4",
    courseCode: "STAT302",
    title: "Regression Review Group",
    description: "Inference, model selection, and diagnostics together.",
    members: 5,
    capacity: 10,
    type: "Online",
  },
  {
    id: "5",
    courseCode: "HIST110",
    title: "Exam 2 Sprint",
    description: "Key events, timelines, and essay structure practice.",
    members: 8,
    capacity: 10,
    type: "Exam Prep",
  },
  {
    id: "6",
    courseCode: "BIO150",
    title: "Cell Biology Diagrams",
    description: "Visual learning session for pathways and organelles.",
    members: 2,
    capacity: 6,
    type: "Offline",
  },
] as const

export type StudySession = {
  id: string
  title: string
  when: string // human-friendly, e.g. "Today, 5:00–7:00 PM"
  mode: "Online" | "Offline"
  attendees: { id: string; name: string }[]
}

export const sessionsByGroup: Record<string, StudySession[]> = {
  "1": [
    {
      id: "s1",
      title: "Dynamic Programming Sprint",
      when: "Today, 5:00–7:00 PM",
      mode: "Online",
      attendees: [
        { id: "u1", name: "Ava" },
        { id: "u2", name: "Max" },
        { id: "u3", name: "Kai" },
      ],
    },
    {
      id: "s2",
      title: "Graphs: Shortest Paths",
      when: "Wed, 6:30–8:00 PM",
      mode: "Offline",
      attendees: [
        { id: "u1", name: "Ava" },
        { id: "u4", name: "Zoey" },
      ],
    },
  ],
  "2": [
    {
      id: "s3",
      title: "Nodal Analysis Workshop",
      when: "Thu, 3:00–4:30 PM",
      mode: "Offline",
      attendees: [
        { id: "u5", name: "Leo" },
        { id: "u6", name: "Maya" },
      ],
    },
  ],
  "3": [
    {
      id: "s4",
      title: "Eigenvalues & Eigenvectors",
      when: "Fri, 9:00–10:30 AM",
      mode: "Online",
      attendees: [
        { id: "u7", name: "Noah" },
        { id: "u8", name: "Ivy" },
        { id: "u9", name: "Omar" },
      ],
    },
  ],
  "4": [
    {
      id: "s5",
      title: "Model Diagnostics Deep-Dive",
      when: "Sat, 11:00 AM–12:30 PM",
      mode: "Online",
      attendees: [
        { id: "u10", name: "Aria" },
        { id: "u11", name: "Liam" },
      ],
    },
  ],
  "5": [
    {
      id: "s6",
      title: "Essay Outline Practice",
      when: "Today, 7:30–9:00 PM",
      mode: "Offline",
      attendees: [
        { id: "u12", name: "Emma" },
        { id: "u13", name: "Ravi" },
      ],
    },
  ],
  "6": [
    {
      id: "s7",
      title: "Pathways Diagramming",
      when: "Sun, 10:00–11:30 AM",
      mode: "Offline",
      attendees: [
        { id: "u14", name: "Mina" },
        { id: "u15", name: "Eli" },
        { id: "u16", name: "Nia" },
      ],
    },
  ],
}

export function getGroupById(id: string) {
  return groups.find((g) => g.id === id)
}

export function getSessionsForGroup(id: string) {
  return sessionsByGroup[id] || []
}
