import { loginAction } from "./actions";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="login-shell"><form className="login-card" action={loginAction}><p className="eyebrow">CMS Desa</p><h1>Login Admin</h1><p className="muted">Masuk menggunakan akun yang dibuat melalui Supabase Authentication.</p>{error ? <div className="alert error">{error}</div> : null}<div className="field"><label>Surel</label><input type="email" name="email" required autoComplete="email" /></div><div className="field" style={{marginTop:14}}><label>Kata sandi</label><input type="password" name="password" required autoComplete="current-password" /></div><button className="button primary full" style={{marginTop:20}} type="submit">Masuk</button></form></main>;
}
