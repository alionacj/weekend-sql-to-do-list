console.log('JS is sourced!');
getItems()


function getItems() {
    console.log('Called getItems(). Getting to-do items...')
    axios ({
        method: 'GET',
        url: '/todos'
    })
    .then((response) => {
        let todos = response.data;
        console.log(' - retrieved todos. Todos:', todos)
        renderDOM(todos)
    })
}
function renderDOM(todos) {
    console.log('Called renderDOM(). Rending DOM...')
    document.getElementById('toDoIncomplete').innerHTML = ''
    document.getElementById('toDoComplete').innerHTML = ''

    for (let todo of todos) {
        if(todo.isComplete === false) {
            document.getElementById('toDoIncomplete').innerHTML +=
            `
                <li>
                    <button onclick=markComplete(${todo.id}) data-testid="completeButton">✅</button>
                    <button onclick=deleteItem(${todo.id}) data-testid="deleteButton">❌</button>
                    <span data-testid="toDoItem">${todo.text}</span>
                </li>
            `
        } else {
            document.getElementById('toDoComplete').innerHTML +=
            `
                <li>
                    <button disabled data-testid="completeButton">✅</button>
                    <button onclick=deleteItem(${todo.id}) data-testid="deleteButton">❌</button>
                    <span data-testid="toDoItem">${todo.text}</span>
                </li>
            `
        }
    }
}
function addItem(event) {
    event.preventDefault()
    console.log('Called addItem(). Adding item...')
    let newItemText = document.getElementById('newItemInput').value
    let newItem = {
        text: newItemText,
        isComplete: false
    }
    axios ({
        method: 'POST',
        url: '/todos',
        data: newItem
    })
    .then((response) => {
        console.log(' - POST successful. Updating display...')
        getItems()
    })
    .catch((error) => {
        console.error('Error! Something went wrong')
    })
}
function markComplete(itemId) {
    console.log(`Called markComplete(). Marking item id ${itemId} complete...`)
    axios({
        method: "PUT",
        url: `/todos/${itemId}`
    })
    .then((response) => {
        console.log(' - PUT request successful! Updating display...')
        getItems()
    })
    .catch((error) => {
        console.error('Error! Something went horribly wrong')
    })
}
function deleteItem(itemId) {
    console.log(`Called deleteItem(). Deleting item id ${itemId}...`)
    axios({
        method: 'DELETE',
        url: `/todos/${itemId}`
    })
    .then((response) => {
        console.log(' - Deletion successful. Updating display...')
        getItems()
    })
}
