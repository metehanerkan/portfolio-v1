import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title') || 'Metehan Erkan';
        const type = searchParams.get('type') || 'Blog';

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
                        color: 'white',
                        fontFamily: 'sans-serif',
                        position: 'relative',
                    }}
                >
                    {/* Arkaplan Efektleri */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '5px',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                    }} />

                    <div style={{
                        position: 'absolute',
                        bottom: -100,
                        left: -100,
                        width: 400,
                        height: 400,
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                    }} />

                    <div style={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
                        <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}>M</div>
                        <div style={{ fontSize: 24, color: '#94a3b8' }}>Metehan Erkan</div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0 60px',
                    }}>
                        <div style={{
                            fontSize: 20,
                            background: '#1e293b',
                            color: '#e2e8f0',
                            padding: '10px 20px',
                            borderRadius: 100,
                            marginBottom: 20,
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                        }}>
                            {type}
                        </div>
                        <div style={{
                            fontSize: 70,
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                            background: 'linear-gradient(to bottom, #fff, #94a3b8)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}>
                            {title.length > 50 ? title.slice(0, 50) + '...' : title}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
