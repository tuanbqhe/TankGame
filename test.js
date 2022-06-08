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

