#!/bin/bash
output="AllCodeFiles.txt"
> "$output"
find . -type f \( -name "*.cs" -o -name "*.csproj" -o -name "*.sln" -o -name "*.xaml" -o -name "*.razor" -o -name "*.json" -o -name "*.config" \) ! -path "*/bin/*" ! -path "*/obj/*" ! -path "*/.git/*" | while read file; do
    echo "## File: $file" >> "$output"
    echo '```' >> "$output"
    cat "$file" >> "$output"
    echo '```' >> "$output"
    echo "" >> "$output"
done
echo "Done! Output saved to $output"
