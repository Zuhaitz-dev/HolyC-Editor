
// Heap Allocation (for dynamic-size strings)
I32 main() {
  U8* original_str = "Testing";
  I32 original_len = StrLen(original_str);

  // Allocate memory on the heap. +1 for the null terminator.
  U8* str_heap = MAlloc(original_len + 1);

  // Copy the string literal into the heap buffer
  StrCpy(str_heap, original_str);

  "Original: %s\n", str_heap;

  I32 length = StrLen(str_heap);
  "Length: %d\n", length;

  // Operate on the mutable heap buffer
  StrReverse(str_heap, length);
  "Reversed: %s\n", str_heap;

  // IMPORTANT: Free the allocated memory
  Free(str_heap);

  return 0;
}