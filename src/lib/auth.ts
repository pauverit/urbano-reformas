export interface Session {
    id: string;
    usuario: string;
    nombre: string;
}

const KEY = 'urbano_session';

export const saveSession = (s: Session) => localStorage.setItem(KEY, JSON.stringify(s));

export const getSession = (): Session | null => {
    try {
        const v = localStorage.getItem(KEY);
        return v ? JSON.parse(v) : null;
    } catch { return null; }
};

export const clearSession = () => localStorage.removeItem(KEY);
