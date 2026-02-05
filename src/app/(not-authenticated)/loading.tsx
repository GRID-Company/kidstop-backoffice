"use client";

import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
      <Spinner className="pt-14" label="Cargando..." />
    </div>
  );
}
