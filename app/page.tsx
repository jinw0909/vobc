import {redirect} from 'next/navigation';
import './styles.css';
// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
    redirect('/en');
}