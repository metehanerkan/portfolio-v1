import { redirect } from 'next/navigation';

export default function PortalRedirect() {
    // Bu sayfaya gelen herkesi direkt login'e atar.
    redirect('/portal/login');
}