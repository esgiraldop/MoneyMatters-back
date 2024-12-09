import { Transform } from "class-transformer";

export function ToLowerCase() {
  return Transform(({ value }) =>
    typeof value === "string" ? value.toLowerCase() : value
  );
}
