export async function loadRequiredContent<T>(
  label: string,
  loader: () => Promise<T>
): Promise<T> {
  try {
    return await loader();
  } catch (cause) {
    throw new Error(`Failed to load required content: ${label}`, { cause });
  }
}
