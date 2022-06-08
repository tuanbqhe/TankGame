 class person {
      constructor() {
          this.name = 'John';
          this.age = 13;
      }
}
class student extends person {
    constructor() {
        super();
        this.grade = 2;
    }
    print () {
        console.log("hello");
    }
}

const stu = new student();
const per = new person();
let k = stu;
stu.age = 100;

console.log(k);
asdfsadwrerw
asdfsd

