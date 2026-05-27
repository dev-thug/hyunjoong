"use client";

import { ReactNode } from "react";

interface DeviceMockupProps {
  type: "macbook" | "iphone" | "desktop";
  children: ReactNode;
}

export default function DeviceMockup({ type, children }: DeviceMockupProps) {
  switch (type) {
    case "macbook":
      return (
        <div className="relative">
          <div className="bg-gray-800 rounded-t-2xl p-(--space-4) pb-0">
            <div className="flex gap-(--space-2) mb-(--space-4)">
              <div
                className="bg-red-500 rounded-full"
                style={{ width: "var(--space-3)", height: "var(--space-3)" }}
              />
              <div
                className="bg-yellow-500 rounded-full"
                style={{ width: "var(--space-3)", height: "var(--space-3)" }}
              />
              <div
                className="bg-green-500 rounded-full"
                style={{ width: "var(--space-3)", height: "var(--space-3)" }}
              />
            </div>
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              {children}
            </div>
          </div>
          <div className="bg-gray-700 rounded-b-2xl flex items-center justify-center h-(--space-6)">
            <div
              className="bg-gray-600 rounded-full"
              style={{ width: "64px", height: "var(--space-1)" }}
            />
          </div>
        </div>
      );
    case "iphone":
      return (
        <div
          className="relative mx-auto"
          style={{
            width: "256px",
          }}
        >
          <div className="bg-gray-900 rounded-[2.5rem] p-(--space-2)">
            <div className="bg-black rounded-[2rem] overflow-hidden aspect-[9/19.5]">
              <div className="bg-gray-900 flex items-center justify-center h-(--space-8)">
                <div
                  className="bg-gray-800 rounded-full"
                  style={{
                    width: "64px",
                    height: "16px",
                  }}
                />
              </div>
              <div className="flex-1">{children}</div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="relative">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-video">
            {children}
          </div>
        </div>
      );
  }
}
