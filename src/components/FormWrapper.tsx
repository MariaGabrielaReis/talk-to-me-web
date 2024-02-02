"use client";

import { useState } from "react";

import Create from "./Create";
import Join from "./Join";

export default function FormWrapper() {
  const [selectedTab, setSelectedTab] = useState<"join" | "create">("join");

  return (
    <div className="w-full">
      <div className="flex items-center text-center ">
        <span
          className={`w-1/2 p-4 rounded-t-md cursor-pointer ${
            selectedTab === "join" ? "bg-dark-gray" : "text-cyan"
          }`}
          onClick={() => setSelectedTab("join")}
        >
          Ingressar
        </span>
        <span
          className={`w-1/2 p-4 rounded-t-md cursor-pointer ${
            selectedTab === "create" ? "bg-dark-gray" : "text-cyan"
          }`}
          onClick={() => setSelectedTab("create")}
        >
          Nova reunião
        </span>
      </div>

      <div className="min-w-[500px] p-6 rounded-b-md space-y-6 px-10 bg-dark-gray">
        {selectedTab === "join" ? <Join /> : <Create />}
      </div>
    </div>
  );
}
