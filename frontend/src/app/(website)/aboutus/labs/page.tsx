"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Cpu,
  UserCheck,
  Search,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Server,
  Monitor,
  Database,
  Network,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function LabsPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");
  const hasData = activeDepartment.slug === "cse";

  const labs = [
    {
      id: "lab-1",
      name: "High Performance Computing & GPU Research Lab",
      location: "Lab Room 101, Ground Floor",
      head: "Prof. Lalit Kumar Awasthi",
      workstations: "35 High-End GPU Workstations",
      hardware: "NVIDIA DGX Station, Tesla V100 GPU nodes, dual Intel Xeon processors, 128GB RAM per node.",
      description: "Dedicated to parallel algorithms, large-scale deep learning model training, scientific simulations, and distributed cloud computing.",
      icon: Cpu,
    },
    {
      id: "lab-2",
      name: "Artificial Intelligence & Robotics Lab",
      location: "Lab Room 102, Ground Floor",
      head: "Dr. Mohammad Khalid Pandit",
      workstations: "30 AI Workstations + Robotic Kits",
      hardware: "NVIDIA RTX 4090 Workstations, TurtleBot3 mobile robots, LiDAR sensors, and RealSense depth cameras.",
      description: "Supports advanced research in computer vision, transformer architectures, reinforcement learning, and autonomous robotic navigation.",
      icon: Sparkles,
    },
    {
      id: "lab-3",
      name: "Cyber Security & Cryptography Lab",
      location: "Lab Room 201, First Floor",
      head: "Dr. Kamlesh Dutta",
      workstations: "32 Isolated Network Nodes",
      hardware: "Isolated network racks, hardware security modules (HSM), Wireshark packet analyzers, and malware analysis sandboxes.",
      description: "Focuses on network intrusion detection, blockchain protocols, zero-trust architectures, and cryptographic algorithm benchmarking.",
      icon: ShieldCheck,
    },
    {
      id: "lab-4",
      name: "Cloud Computing & Internet of Things (IoT) Lab",
      location: "Lab Room 202, First Floor",
      head: "Dr. Naveen Chauhan",
      workstations: "30 IoT Workstations + Sensor Kits",
      hardware: "Raspberry Pi 4 / 5 clusters, ESP32 development boards, LoRaWAN gateways, and Zigbee sensor networks.",
      description: "Smart edge computing architectures, wireless sensor networks, telemetry data pipelines, and IoT cloud integrations.",
      icon: Server,
    },
    {
      id: "lab-5",
      name: "Virtual Reality & Human Computer Interaction Lab",
      location: "Lab Room 203, First Floor",
      head: "Dr. Siddhartha Chauhan",
      workstations: "25 VR Stations + HMDs",
      hardware: "Meta Quest Pro & HTC Vive VR Headsets, motion capture trackers, haptic feedback gloves, and 4K stereoscopic displays.",
      description: "Spatial computing, metaverse environments, 3D anatomical simulations, and accessible gesture-based user interfaces.",
      icon: Monitor,
    },
    {
      id: "lab-6",
      name: "Data Analytics & Knowledge Engineering Lab",
      location: "Lab Room 301, Second Floor",
      head: "Dr. Arun Kumar Yadav",
      workstations: "35 Enterprise Workstations",
      hardware: "Apache Hadoop / Spark distributed cluster nodes, high-speed NVMe storage arrays, and enterprise DBMS servers.",
      description: "Dedicated to large-scale data mining, NLP information retrieval, sentiment analysis of legal documents, and knowledge graph engineering.",
      icon: Database,
    },
    {
      id: "lab-7",
      name: "Software Engineering & Systems Development Lab",
      location: "Lab Room 302, Second Floor",
      head: "Dr. T P Sharma",
      workstations: "45 Development Workstations",
      hardware: "CI/CD testing servers, automated code profiling testbeds, and cross-platform mobile development suites.",
      description: "Facilitates undergraduate software design projects, agile software engineering, test-driven development, and enterprise architectures.",
      icon: Layers,
    },
    {
      id: "lab-8",
      name: "Computer Networks & Wireless Communication Lab",
      location: "Lab Room 303, Second Floor",
      head: "Dr. Pardeep Singh",
      workstations: "36 Network Stations",
      hardware: "Cisco managed switches & routers, Software-Defined Networking (SDN) controllers, NS-3 and Mininet testbeds.",
      description: "Covers routing protocol verification, 5G/6G network simulation, wireless ad-hoc networks (VANET/MANET), and QoS optimization.",
      icon: Network,
    },
    {
      id: "lab-9",
      name: "Microprocessor & Embedded Systems Lab",
      location: "Lab Room 104, Ground Floor",
      head: "Dr. Rajeev Kumar",
      workstations: "30 Embedded Kits & Oscilloscopes",
      hardware: "ARM Cortex-M development boards, 8086/8051 microprocessor kits, FPGA development boards (Xilinx Artix-7), and digital storage oscilloscopes.",
      description: "Embedded firmware development, hardware-software co-design, real-time operating systems (FreeRTOS), and VLSI interface prototyping.",
      icon: Cpu,
    },
    {
      id: "lab-10",
      name: "PG & Doctoral Research Laboratory",
      location: "Lab Room 401, Third Floor",
      head: "Dr. Sangeeta Sharma",
      workstations: "50 Dedicated Research Cubicles",
      hardware: "Dual-monitor dedicated workstations for M.Tech and Ph.D. scholars with Gigabit LAN connectivity and central cluster access.",
      description: "Dedicated full-time research environment for postgraduate dissertation work and doctoral research projects.",
      icon: UserCheck,
    },
  ];

  const filteredLabs = useMemo(() => {
    if (!hasData) return [];
    return labs.filter((l) => {
      const q = search.toLowerCase();
      return (
        !search ||
        l.name.toLowerCase().includes(q) ||
        l.head.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    });
  }, [search, hasData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#85261e]" />
              Laboratories &amp; Research Facilities
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Specialized computing facilities, GPU clusters, sensor testbeds, and research spaces of Department of{" "}
            {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Laboratory & Research Facilities" />
      ) : (
        <>
          {/* Search & Stats Bar */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search lab name, faculty in-charge, or area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            <span className="text-xs font-semibold text-neutral-600">
              Showing {filteredLabs.length} of {labs.length} Research &amp; Teaching Labs
            </span>
          </div>

          {/* Labs Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white border border-[#eedfd8] rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-[#eedfd8]/60 pb-3">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-500">
                      <Building2 className="w-3.5 h-3.5 text-[#85261e]" /> {lab.location}
                    </span>
                    <span className="bg-[#fff9f6] border border-[#eedfd8] text-[#85261e] text-[10px] font-bold px-2 py-0.5 rounded">
                      {lab.workstations}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[#1c110c] mt-3 leading-snug">
                    {lab.name}
                  </h2>

                  <p className="text-xs text-neutral-700 leading-relaxed mt-2">
                    {lab.description}
                  </p>

                  <div className="mt-3 bg-[#fff9f6] border border-[#eedfd8]/80 rounded-lg p-2.5 text-[11px] text-neutral-600">
                    <strong className="text-[#33110e] font-bold">Key Hardware &amp; Toolkits:</strong> {lab.hardware}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#eedfd8]/60 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-neutral-600">
                    <UserCheck className="w-3.5 h-3.5 text-[#85261e]" /> Lab In-Charge:{" "}
                    <strong className="text-[#1c110c]">{lab.head}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
