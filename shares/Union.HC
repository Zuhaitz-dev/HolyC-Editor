
#define FLOAT_TYPE  0
#define CHAR_TYPE   1
#define VALUE_TYPE  2

class Value;

class Value 
{
  I32 type;
  
  union
  {
    F64 f;
    U8 ch;
    Value *val;
  };
};

I32 main() {
  Value *v1 = MAlloc(sizeof(Value));
  v1->type = FLOAT_TYPE;
  v1->f = 4.20;
  "Value (%d) => %f\n", v1->type, v1->f;

  Value v2;
  v2.type=CHAR_TYPE;
  v2.ch = 'Z';
  "Value (%d) => %c\n", v2.type, v2.ch;

  return 0;
}