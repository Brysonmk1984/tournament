export default function suffix(number){
    return number === 1 ? "st" : number === 2 ? "nd" : number === 3 ? "rd" : "th";
}