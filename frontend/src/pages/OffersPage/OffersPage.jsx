import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import API_URL from "../../config/api"

import styles from "./OffersPage.module.css"

export default function OffersPage() {

  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])

  const [search, setSearch] = useState("")

  const navigate = useNavigate()

  // FETCH
  useEffect(() => {

    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {

        // SOLO OFERTAS
        const offers = data.filter(product =>
          product.variants?.some(variant =>
            variant.salePrice != null &&
            Number(variant.salePrice) <
            Number(variant.sellingPrice)
          )
        )

        setProducts(offers)
        setFiltered(offers)

      })
      .catch(err => {
        console.error(err)
      })

  }, [])

  // SEARCH
  useEffect(() => {

    let result = [...products]

    if (search.trim()) {

      result = result.filter(product =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )

    }

    setFiltered(result)

  }, [search, products])

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>
        Ofertas
      </h1>

      {/* SEARCH */}
      <div className={styles.searchBar}>

        <input
          type="text"
          placeholder="Buscar ofertas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

      </div>

      {/* PRODUCTS */}
      <section className={styles.products}>

        {filtered.length === 0 && (
          <p className={styles.noResults}>
            No hay ofertas disponibles.
          </p>
        )}

        {filtered.flatMap(product =>

          product.variants
            ?.filter(variant =>
              variant.salePrice != null &&
              Number(variant.salePrice) <
              Number(variant.sellingPrice)
            )
            .map(variant => (

              <div
                key={variant.id}
                className={styles.card}
                onClick={() =>
                  navigate(`/product/${product.id}`)
                }
              >

                <img
                  src={
                    variant?.images?.[0]?.url ||
                    variant?.imageUrl ||
                    "/placeholder.jpg"
                  }
                  alt={product.name}
                />

                <div className={styles.cardContent}>

                  <span className={styles.category}>
                    {product.category?.name}
                  </span>

                  <h3>{product.name}</h3>

                  <p className={styles.variant}>
                    {variant.name}
                  </p>

                  {/* PRICES */}
                  <div className={styles.priceBox}>

                    <span className={styles.oldPrice}>
                      €
                      {Number(
                        variant.sellingPrice
                      ).toFixed(2)}
                    </span>

                    <span className={styles.salePrice}>
                      €
                      {Number(
                        variant.salePrice
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

            ))

        )}

      </section>

    </div>
  )
}