
import { person, sayHello } from './lib'

/*console.log(person.name);
console.log(sayHello('Sergey'));

let test = () => console.log("Hello");
test();*/

async function getPosts() {
    const response = await fetch
        ('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        return data;
}

getPosts().then(posts => console.log(posts));
