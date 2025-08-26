# Going Mobile: La Aplicación de Comercio Justo

![Going Logo](URL_DEL_LOGO_AQUI) <!-- Reemplazar con la URL de un logo cuando esté disponible -->

**Going Mobile** es la aplicación de usuario para el ecosistema "Going", una red de comercio descentralizado construida sobre Solana. Esta aplicación es la puerta de entrada para que compradores y vendedores interactúen con nuestro protocolo de una manera simple e intuitiva.

Nuestra misión es arreglar el modelo extractivo del e-commerce actual, devolviendo el poder y el valor a los usuarios a través de comisiones justas y un sistema de recompensas único.

---

## ✨ Características Principales

- **Marketplace Descentralizado:** Explora y compra productos y servicios en una red peer-to-peer.
- **Escrow Inteligente:** Cada compra está protegida por nuestro smart contract de escrow, que retiene los fondos hasta que la entrega es confirmada.
- **Recompensas por Staking ($G):** Gana rendimientos mientras esperas tu pedido. Los fondos en escrow se ponen en staking y los beneficios se reparten entre comprador y vendedor en forma de puntos $G.
- **Confirmación Segura por QR:** Confirma la recepción de tus productos de forma segura y fácil escaneando un código QR, liberando los fondos al vendedor instantáneamente.
- **Billetera Integrada:** Revisa tu saldo de USDC y tus recompensas $G directamente en la aplicación.

---

## 🛠️ Stack Tecnológico

- **Framework:** React Native con Expo
- **Estilos:** NativeWind (Tailwind CSS para React Native)
- **Blockchain:** Solana (usando `@solana/web3.js`)
- **Autenticación:** Privy.io

---

## 🚀 Cómo Empezar (Para Desarrolladores)

Sigue estos pasos para levantar el proyecto en tu entorno local.

**1. Clona el Repositorio:**
```bash
git clone [URL_DEL_REPOSITORIO]
cd going_mobile
```

**2. Instala las Dependencias:**
```bash
# Usando npm
npm install

# O usando yarn
yarn install
```

**3. Configura tus Variables de Entorno:**
Crea un archivo `.env` en la raíz del proyecto y añade las claves necesarias (ej. `EXPO_PUBLIC_PRIVY_APP_ID`).

**4. Inicia la Aplicación:**
```bash
# Iniciar el servidor de desarrollo limpiando el caché
npx expo start -c
```

---

## 🤝 Contribuciones

Nuestro protocolo core será de código abierto. Si estás interesado en contribuir al ecosistema "Going", por favor revisa nuestra guía de contribución (próximamente).