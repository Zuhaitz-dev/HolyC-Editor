
class Person
{
  U8 *name;
  U16 age;
};

U0 StacKExample()
{
  Person p;
  Person *ptr = &p;
  ptr->name = "Robert";
  ptr->age = 45;

  "%d %d %s %s\n", p.age, ptr->age, p.name, ptr->name;
}

U0 HeapExample()
{
  Person *p = MAlloc(sizeof(Person));
  p->name = "Bob";
  p->age = 23;
  "%d %s\n", p->age, p->name;
}

I32 main() 
{
  StacKExample();
  HeapExample();

  return 0;
}
