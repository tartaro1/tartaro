const deleteButtons = document.querySelectorAll(".delete-user-btn");
deleteButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    const productListItem = e.target.closest('.user-list-item');
    const productName = productListItem.querySelector('.nombre').innerText;
    const modalTitle = document.querySelector("#staticBackdropLabel");
    modalTitle.innerText = `¿Deseas eliminar el producto: "${productName}"?`;
    const id = productListItem.querySelector('.id').innerText;
    const modalAcceptButton = document.querySelector(".accept");
    modalAcceptButton.addEventListener("click", () => {
      fetch(`http://localhost:9200/products/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (res.ok) {
            productListItem.remove();
          }
        })
        .catch(error => console.error('Error deleting product:', error));
    });
  });
});
const browser = document.querySelector(".browse")
browser.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const category = browser.value.trim();
    if (category) {
      window.location.href = `http://localhost:3000/dashboard/products?category=${category}`;
    }
  }
});
const editButtons = document.querySelectorAll(".edit-user-btn");
editButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const productListItem = e.target.closest('.user-list-item');
    const id = productListItem.querySelector('.id').innerText;
    const nombreElement = document.querySelector(".nombreEdit");
    const categoriaElement = document.querySelector(".categoriaEdit");
    const marcaElement = document.querySelector(".marcaEdit");
    const descripcionElement = document.querySelector(".descripcionEdit");
    const precioElement = document.querySelector(".precioEdit");
    const calificacionElement = document.querySelector(".calificacionEdit");
    const proveedorElement = document.querySelector(".proveedorEdit");
    const urlElement = document.querySelector(".urlEdit")
    const disponibilidadElement = document.querySelector(".disponibilidadEdit")
    fetch(`http://localhost:9200/products/${id}`)
      .then(res => res.json())
      .then(productArray => {
        if (productArray && productArray.length > 0) {
          const product = productArray[0];
          if (nombreElement && marcaElement && descripcionElement && precioElement && categoriaElement && calificacionElement && proveedorElement) {
            nombreElement.value = product.NombreProducto;
            categoriaElement.value = product.ID_Categoria;
            marcaElement.value = product.Marca;
            proveedorElement.value = product.ID_Proveedor;
            descripcionElement.value = product.Descripcion;
            precioElement.value = product.PrecioVenta;
            calificacionElement.value = product.Calificacion;
            urlElement.value = product.imagen;
            disponibilidadElement.value = product.Disponibilidad
            const saveEditButton = document.querySelector(".btn-save-edit");
            saveEditButton.addEventListener("click", () => {
              if (nombreElement && marcaElement && descripcionElement && precioElement && categoriaElement && calificacionElement && proveedorElement) {
                const nombre = nombreElement.value;
                const categoria = parseInt(categoriaElement.value);
                const marca = marcaElement.value;
                const proveedor = parseInt(proveedorElement.value);
                const descripcion = descripcionElement.value;
                const precio = parseInt(precioElement.value);
                const calificacion = parseInt(calificacionElement.value);
                const imagen = urlElement.value;
                const disponibilidad = parseInt(disponibilidadElement.value);
                const id = productListItem.querySelector('.id').innerText;
                fetch(`http://localhost:9200/products/${id}`, {
                  method: 'PATCH',
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    NombreProducto: nombre,
                    ID_Categoria: categoria,
                    Marca: marca,
                    ID_Proveedor: proveedor,
                    Descripcion: descripcion,
                    PrecioVenta: precio,
                    Calificacion: calificacion,
                    Disponibilidad: disponibilidad,
                    imagen: imagen
                  })
                })
                  .then(res => {
                    if (res.ok) {
                      return res.json();
                    } else {
                      throw new Error('Error updating product');
                    }
                  })
                  .then(data => {
                    console.log("produ updated successfully:", data);
                    const modal = bootstrap.Modal.getInstance(document.querySelector('#exampleEditUserModal'));
                    modal.hide();
                    location.reload();
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });
              }
            }, { once: true });
          }
        } else {
          console.error("No user data found for the provided ID");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});
const savebtn = document.querySelector(".btn-save");
savebtn.addEventListener("click", () => {
  const nombreElement = document.querySelector(".nombre");
  const categoriaElement = document.querySelector(".categoria");
  const marcaElement = document.querySelector(".marca");
  const descripcionElement = document.querySelector(".descripcion");
  const precioElement = document.querySelector(".precio");
  const calificacionElement = document.querySelector(".calificacion");
  const proveedorElement = document.querySelector(".proveedor");
  const urlElement = document.querySelector(".url")
  
  if (nombreElement && marcaElement && descripcionElement && precioElement && categoriaElement && calificacionElement && proveedorElement && urlElement) {
    const nombre = nombreElement.value;
    const categoria = parseInt(categoriaElement.value);
    const marca = marcaElement.value;
    const proveedor = parseInt(proveedorElement.value);
    const descripcion = descripcionElement.value;
    const precio = parseInt(precioElement.value);
    const calificacion = parseInt(calificacionElement.value);
    const imagen = urlElement.value;

    fetch("http://localhost:9200/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre: nombre,
        id_categoria: categoria,
        marca: marca,
        id_proveedor: proveedor,
        descripcion: descripcion,
        precio: precio,
        calificacion: calificacion,
        imagen: imagen
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        console.log("Success:", data);
        const modal = bootstrap.Modal.getInstance(document.querySelector('#exampleAddUserModal'));
        modal.hide();
        location.reload();
      })
      .catch(error => {
        console.error("Error:", error);
      });
  } else {
    console.error("One or more input fields are missing");
  }
});