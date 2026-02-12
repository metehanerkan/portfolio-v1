import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Metehan Erkan | Software Engineer';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#030014',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #ffffff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ffffff 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(10, 10, 10, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        padding: '40px 80px',
                        boxShadow: '0 0 50px -10px rgba(168, 85, 247, 0.3)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 60,
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #a855f7, #6366f1)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: 20,
                            letterSpacing: '-2px',
                        }}
                    >
                        METEHAN ERKAN
                    </div>
                    <div
                        style={{
                            fontSize: 30,
                            color: '#e2e8f0',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Software Engineer
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
