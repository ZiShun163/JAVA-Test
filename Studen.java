package itheima;
class a {
    String name ;
    double chinese ;
    double english ;
    void read(){
        System.out.println(name+"平均分为"+(chinese+english)/2.0);
        System.out.println(name+"总分数为"+(chinese+english));
    }
}
class Student{
    public static void main(String[] args) {
        a s1 = new a();
        a s2 = new a();
        s1.name="帅哥";
        s1.chinese=85;
       s1.english=90;
       s1.read();
       s2.name="大帅哥";
       s2.chinese=88;
       s2.english=99;
       s2.read();
    }
}
