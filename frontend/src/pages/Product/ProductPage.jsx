import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API_URL from "../../config/api"
import { useCart } from "../../context/CartContext";
import styles from "./ProductPage.module.css"


export default function ProductPage() {
  const { addToCart } = useCart();
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)

  useEffect(() => {

    fetch(`${API_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data)
      })
      .catch(err => {
        console.error(err)
      })

  }, [id])

  if (!product) {
    return <p>Cargando...</p>
  }

  const variant = product.variants?.[0]

  const price =
    variant?.salePrice != null
      ? variant.salePrice
      : variant?.sellingPrice

  return (
    <div className={styles.container}>
        <button
            className={styles.backButton}
            onClick={() => navigate(-1)}
        > ← Volver </button>
        <div className={styles.productInfo}>
            {/* IMAGE */}
            <div className={styles.imageSection}>
                <img
                src={
                    variant?.images?.[0]?.url ||
                    variant?.imageUrl
                }
                alt={product.name}
                />
            </div>

            {/* INFO */}
            <div className={styles.infoSection}>

                <span className={styles.category}>
                {product.category?.name}
                </span>

                <h1>{product.name}</h1>

                <p className={styles.variant}>
                {variant?.name}
                </p>

                <p className={styles.description}>
                {product.description}
                </p>

                <div className={styles.priceBox}>

                    {variant?.salePrice != null && (
                        <span className={styles.oldPrice}>
                        €
                        {Number(
                            variant.sellingPrice
                        ).toFixed(2)}
                        </span>
                    )}

                    <span className={styles.price}>
                        €
                        {Number(price).toFixed(2)}
                    </span>

                </div>

                <button className={styles.cartButton}
                    onClick={() =>
                        addToCart({
                            productId: product.id,
                            variantId: variant.id,
                            name: product.name,
                            variantName: variant.name,
                            price: variant.sellingPrice,
                            image: variant.images?.[0]?.url,
                            sku: variant.sku,
                        })
                    }>
                Añadir al carrito
                </button>


            </div>
        </div>       
    </div>
  )
}