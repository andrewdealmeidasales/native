import { Audio } from 'expo-av'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Index() {
  const cameraRef = useRef<CameraView>(null)
  const [permission, requestPermission] = useCameraPermissions()

  const [flash, setFlash] = useState(false)
  const [speed, setSpeed] = useState<number | null>(null)

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [])

  function lanterna() {
    if (!permission?.granted) return
    setFlash((v) => !v)
  }

  function vibrar() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  }

  async function som() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/beep.mp3')
    )
    await sound.playAsync()
  }

  async function velocimetro() {
    const { status } =
      await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') return

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (loc) => {
        const v = loc.coords.speed
        setSpeed(v ? v * 3.6 : 0)
      }
    )
  }

  return (
    <View style={styles.container}>
      {/* câmera invisível apenas para lanterna */}
      <CameraView
        ref={cameraRef}
        style={{ width: 1, height: 1 }}
        facing="back"
        enableTorch={flash}
      />

      <Text style={styles.title}>Central de Testes</Text>

      <View style={styles.grid}>
        <Botao texto="🔦 Lanterna" onPress={lanterna} />
        <Botao texto="📳 Vibração" onPress={vibrar} />
        <Botao texto="🔊 Áudio" onPress={som} />
        <Botao texto="🚗 Velocímetro" onPress={velocimetro} />
      </View>

      {speed !== null && (
        <Text style={styles.speed}>
          {speed.toFixed(1)} km/h
        </Text>
      )}
    </View>
  )
}

function Botao({ texto, onPress }: any) {
  return (
    <TouchableOpacity style={styles.botao} onPress={onPress}>
      <Text style={styles.botaoTexto}>{texto}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  botao: {
    width: '42%',
    height: 110,
    margin: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
  },
  speed: {
    marginTop: 20,
    fontSize: 30,
    color: '#00ff99',
  },
})
