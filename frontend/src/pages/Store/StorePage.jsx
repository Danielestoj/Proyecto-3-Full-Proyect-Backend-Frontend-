import { useEffect, useState } from "react"
import API_URL from "../../config/api"
import styles from "./StorePage.module.css"

export default function StorePage() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState(300)

  // 🔹 FETCH PRODUCTS
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        setFiltered(data)
      })
      .catch(err => {
        console.error("Error loading products:", err)
      })
  }, [])

  // 🔹 FILTERS
  useEffect(() => {
    let result = [...products]

    // SEARCH
    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // CATEGORY
    if (category) {
      result = result.filter(
        p => p.category?.name === category
      )
    }

    // PRICE
    result = result.filter(p =>
      p.variants?.some(v =>
        Number(v.sellingPrice) <= price
      )
    )

    setFiltered(result)
  }, [search, category, price, products])

  // 🔹 UNIQUE CATEGORIES
  const categories = [
    ...new Set(
      products
        .map(p => p.category?.name)
        .filter(Boolean)
    )
  ]

  return (
    <div className={styles.container}>

      {/* 🔍 SEARCH */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.body}>

        {/* FILTERS */}
        <aside className={styles.filters}>
          <h2>Filtros</h2>

          {/* CATEGORY */}
          <div className={styles.filterGroup}>
            <label>Categoría</label>

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Todas</option>

              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE */}
          <div className={styles.filterGroup}>
            <label>Precio máximo</label>

            <div className={styles.priceBox}>
              <span>
                0€ - {price}€
              </span>
              <input
                type="range"
                min="0"
                max="300"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className={styles.slider}
              />

            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <section className={styles.products}>

        {filtered.length === 0 && (
            <p className={styles.noResults}>
            No se encontraron productos.
            </p>
        )}

        {filtered.flatMap(product =>
            product.variants?.map(variant => (
            <div
                key={variant.id}
                className={styles.card}
            >
                <img
                src={
                    variant?.images?.[0]?.url ||
                    variant?.imageUrl ||
                    "/placeholder.jpg"
                }
                alt={`${product.name} ${variant.name}`}
                />

                <div className={styles.cardContent}>

                <span className={styles.category}>
                    {product.category?.name}
                </span>

                <h3>{product.name}</h3>

                <p className={styles.variant}>
                    {variant?.name}
                </p>

                {/* EXTRA INFO */}
                <div className={styles.meta}>

                    {variant.language && (
                    <span>{variant.language}</span>
                    )}

                    {variant.condition && (
                    <span>{variant.condition}</span>
                    )}

                    {variant.isFoil && (
                    <span>Foil</span>
                    )}

                    {variant.isFirstEdition && (
                    <span>1ª Edición</span>
                    )}

                </div>

                <strong className={styles.price}>
                    €
                    {Number(
                    variant?.sellingPrice || 0
                    ).toFixed(2)}
                </strong>

                </div>
            </div>
            ))
        )}

        </section>
      </div>
    </div>
  )
}