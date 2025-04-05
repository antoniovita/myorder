const CreateItem = () => {

    const handleCreateItem = async () => {
        await fetch('/api/item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                price,
                description,
            }),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Erro ao criar item.");
            }
            return res.json();
        }
        )
    }

    return ( 
        <div>

        </div>
     );
}
 
export default CreateItem;