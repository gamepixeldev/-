# Render the five native tabBar icons at 2x, then downsample to 81px PNGs.
Add-Type -AssemblyName System.Drawing

$assetDirectory = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, '..', 'static', 'tabbar'))
[System.IO.Directory]::CreateDirectory($assetDirectory) | Out-Null

function New-Icon([string]$name, [string]$tone, [string]$colorCode) {
    $color = [System.Drawing.ColorTranslator]::FromHtml($colorCode)
    $large = [System.Drawing.Bitmap]::new(162, 162)
    $graphics = [System.Drawing.Graphics]::FromImage($large)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $pen = [System.Drawing.Pen]::new($color, 9)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $brush = [System.Drawing.SolidBrush]::new($color)
    try {
        switch ($name) {
            'home' {
                $graphics.DrawLine($pen, 29, 77, 81, 35)
                $graphics.DrawLine($pen, 81, 35, 133, 77)
                $graphics.DrawLine($pen, 43, 69, 43, 127)
                $graphics.DrawLine($pen, 43, 127, 119, 127)
                $graphics.DrawLine($pen, 119, 127, 119, 69)
                $graphics.DrawLine($pen, 68, 127, 68, 93)
                $graphics.DrawLine($pen, 68, 93, 94, 93)
                $graphics.DrawLine($pen, 94, 93, 94, 127)
            }
            'reading' {
                $graphics.DrawLine($pen, 81, 51, 81, 126)
                $graphics.DrawLine($pen, 81, 54, 66, 47)
                $graphics.DrawLine($pen, 66, 47, 29, 47)
                $graphics.DrawLine($pen, 29, 47, 29, 116)
                $graphics.DrawLine($pen, 29, 116, 60, 116)
                $graphics.DrawLine($pen, 60, 116, 81, 126)
                $graphics.DrawLine($pen, 81, 54, 96, 47)
                $graphics.DrawLine($pen, 96, 47, 133, 47)
                $graphics.DrawLine($pen, 133, 47, 133, 116)
                $graphics.DrawLine($pen, 133, 116, 102, 116)
                $graphics.DrawLine($pen, 102, 116, 81, 126)
            }
            default {
                $label = switch ($name) { 'grammar' { '文' } 'vocab' { 'Aa' } 'puzzle' { '拼' } }
                $fontSize = if ($name -eq 'vocab') { 66 } else { 78 }
                $font = [System.Drawing.Font]::new('Microsoft YaHei', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
                $format = [System.Drawing.StringFormat]::new()
                $format.Alignment = [System.Drawing.StringAlignment]::Center
                $format.LineAlignment = [System.Drawing.StringAlignment]::Center
                try { $graphics.DrawString($label, $font, $brush, [System.Drawing.RectangleF]::new(0, -2, 162, 162), $format) }
                finally { $font.Dispose(); $format.Dispose() }
            }
        }
        $small = [System.Drawing.Bitmap]::new(81, 81)
        $scaled = [System.Drawing.Graphics]::FromImage($small)
        try {
            $scaled.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $scaled.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
            $scaled.DrawImage($large, 0, 0, 81, 81)
            $target = [System.IO.Path]::Combine($assetDirectory, "$name-$tone.png")
            $small.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        finally { $scaled.Dispose(); $small.Dispose() }
    }
    finally { $brush.Dispose(); $pen.Dispose(); $graphics.Dispose(); $large.Dispose() }
}

foreach ($name in @('home', 'reading', 'grammar', 'vocab', 'puzzle')) {
    New-Icon $name 'default' '#8C98A9'
    New-Icon $name 'active' '#3978EF'
}
