import { NextResponse } from 'next/server'
import { exec } from 'child_process'

export async function POST(request: Request) {
  const { command } = await request.json()

  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  exec(command, (error, stdout, stderr) => {
    if (error) {
      writer.write(new TextEncoder().encode(`Error: ${error.message}\n`))
    }
    if (stderr) {
      writer.write(new TextEncoder().encode(stderr))
    }
    if (stdout) {
      writer.write(new TextEncoder().encode(stdout))
    }
    writer.close()
  })

  return new NextResponse(stream.readable)
} 