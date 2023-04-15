import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function clsxm(...classes: ClassValue[]): string {
  return twMerge(clsx(...classes));
}
