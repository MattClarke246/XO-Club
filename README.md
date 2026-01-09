# XO Club - Street Luxury

A premium streetwear e-commerce platform built with React, TypeScript, and Vite. Features a bold, modern design with immersive animations, product previews, shopping cart functionality, and an integrated conversational AI assistant.

## 🎨 Features

- **Modern UI/UX**: Dark-themed, luxury streetwear aesthetic with smooth animations
- **Product Catalog**: Browse premium streetwear with detailed product previews
- **Shopping Cart**: Persistent cart with localStorage, quantity management, and quick add
- **Checkout Flow**: Multi-step checkout with form validation and order processing
- **AI Assistant**: Integrated ElevenLabs conversational AI widget
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Animated Backgrounds**: Dynamic mesh gradients and particle effects
- **Product Gallery**: Image carousels with thumbnail navigation
- **Social Proof**: User-generated content marquee section

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MattClarke246/XO-Club.git
cd XO-Club
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional):
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

Preview the production build:
```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling (via CDN)
- **Lucide React** - Icon library
- **ElevenLabs Conversational AI** - AI assistant integration

## 📁 Project Structure

```
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── Hero.tsx        # Landing hero section
│   ├── ProductCard.tsx # Product display card
│   ├── ProductPreviewModal.tsx # Product detail modal
│   ├── CartSidebar.tsx # Shopping cart sidebar
│   ├── AnimatedBackground.tsx # Animated background effects
│   └── SocialProof.tsx # Social proof section
├── pages/              # Page components
│   ├── Home.tsx        # Homepage
│   └── Checkout.tsx    # Checkout page
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app component
└── index.tsx           # App entry point
```

## 🎯 Key Functionality

- **Shopping Cart**: Items persist in localStorage
- **Product Management**: Add/remove items, update quantities
- **Order Processing**: Integrated with Google Apps Script for order handling
- **Form Validation**: Client-side validation for checkout
- **Responsive Navigation**: Mobile-friendly menu system

## 📝 Environment Variables

Create a `.env.local` file with:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=your_google_apps_script_url_here
```

## 🎨 Customization

- Product data: Edit `MOCK_PRODUCTS` in `pages/Home.tsx`
- Styling: Modify Tailwind classes or add custom CSS in `index.css`
- Colors: Update Tailwind config or use inline classes for brand colors

## 📄 License

This project is private and proprietary.

## 👤 Author

XO Club

---

Built with ❤️ for the streetwear community
