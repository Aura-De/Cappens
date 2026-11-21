# Quita el relleno gris plano dentro de "cappens" (contadores a, p, p, e) sin tocar el delfín.
param(
  [string]$InputPath = "$PSScriptRoot\..\public\logo-cappens-nav.source.png",
  [string]$OutputPath = "$PSScriptRoot\..\public\logo-cappens-nav-clean.png"
)

Add-Type -AssemblyName System.Drawing

function Test-PaperFill([System.Drawing.Color]$c) {
  if ($c.A -lt 20) { return $false }
  $dr = [Math]::Abs($c.R - 196); $dg = [Math]::Abs($c.G - 193); $db = [Math]::Abs($c.B - 187)
  if ($dr -le 12 -and $dg -le 12 -and $db -le 12) { return $true }
  $spread = [Math]::Max($c.R, [Math]::Max($c.G, $c.B)) - [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
  if ($spread -gt 14) { return $false }
  if ($c.R -ge 168 -and $c.G -ge 165 -and $c.B -ge 158 -and $c.R -le 212) { return $true }
  return $false
}

if (-not (Test-Path $InputPath)) {
  Write-Error "Missing input: $InputPath (copy current logo there once if needed)"
  exit 1
}

$bmp = [System.Drawing.Bitmap]::FromFile($InputPath)
$out = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$textMinX = 330
$removed = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
  for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if ($x -ge $textMinX -and (Test-PaperFill $c)) {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      $removed++
    } else {
      $out.SetPixel($x, $y, $c)
    }
  }
}

$dir = Split-Path $OutputPath
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
$tmp = [System.IO.Path]::Combine($dir, "logo-cappens-nav.tmp.png")
$out.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$out.Dispose()
if (Test-Path $OutputPath) { Remove-Item $OutputPath -Force }
Move-Item -Force $tmp $OutputPath
Write-Host "Removed $removed fill pixels -> $OutputPath"
