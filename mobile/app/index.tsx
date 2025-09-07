import { useEffect, useState } from 'react'
import { Alert, Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000'

type Product = { id: number; name: string; description: string; price: number }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  async function load() {
    const res = await fetch(`${API_URL}/products`)
    const data = await res.json()
    setProducts(data.map((p: any) => ({ ...p, price: typeof p.price === 'string' ? parseFloat(p.price) : p.price })))
  }

  useEffect(() => { load() }, [])

  async function add() {
    const n = name.trim(); const d = description.trim(); const p = parseFloat(price)
    if (!n || !d || price === '') return Alert.alert('Error', 'Todos los campos son obligatorios')
    if (Number.isNaN(p) || p <= 0) return Alert.alert('Error', 'Precio inválido')
    const res = await fetch(`${API_URL}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: n, description: d, price: p }) })
    if (!res.ok) { const m = await res.json().catch(() => ({})); return Alert.alert('Error', m.error || 'Error al crear') }
    setName(''); setDescription(''); setPrice('');
    await load()
  }

  async function remove(id: number) {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Agregar producto</Text>
        <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Descripción" value={description} onChangeText={setDescription} style={[styles.input, { height: 80 }]} multiline />
        <TextInput placeholder="Precio" value={price} onChangeText={setPrice} style={styles.input} keyboardType="decimal-pad" />
        <Button title="Crear" onPress={add} />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Productos</Text>
        <FlatList
          data={products}
          keyExtractor={(i) => String(i.id)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={{ color: '#64748b' }}>{item.description}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>
              <Button title="Eliminar" color="#ef4444" onPress={() => remove(item.id)} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220', padding: 16, gap: 16 },
  card: { backgroundColor: '#121a2b', borderRadius: 12, padding: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#e8eefc', marginBottom: 8 },
  input: { backgroundColor: '#0e1626', color: '#e8eefc', borderRadius: 8, padding: 10, marginBottom: 8 },
  row: { backgroundColor: '#0e1626', borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontWeight: '700', color: '#e8eefc' },
  price: { color: '#e8eefc' }
})


