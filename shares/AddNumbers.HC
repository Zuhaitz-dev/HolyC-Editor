I64 AddNumbers(I64 a, I64 b) {
    return a + b;
}

I32 main() {
    I64 num1 = 10;
    I64 num2 = 25;
    I64 result;
    U8* greeting = "Hello from HolyC!";

    "%s\n", greeting;

    result = AddNumbers(num1, num2);

    "The sum of %d and %d is: %d\n", num1, num2, result;
    "5 times 8 is: %d\n", 5 * 8;

    return 0;
}
