const students = JSON.parse(window.localStorage.getItem("nourAcademyInscriptions")) 


// click


let student = {}

let newdata = students.push(student)


window.localStorage.setItem("nourAcademyInscriptions", JSON.stringify(newdata))



//
function  update(Id, st) {
    let student;
    for (let i = 0; i < students.length; i++) {
        student = students[i]

        if(student.id == Id) {
            student.status = st
        }
        
    }
}  




