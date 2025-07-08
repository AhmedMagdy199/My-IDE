package storage

import (
    "io"
    "os"
    "path/filepath"
)

type FileStorage struct {
    basePath string
}

func NewFileStorage(basePath string) *FileStorage {
    return &FileStorage{
        basePath: basePath,
    }
}

func (fs *FileStorage) SaveFile(path string, content io.Reader) error {
    fullPath := filepath.Join(fs.basePath, path)
    dir := filepath.Dir(fullPath)
    
    if err := os.MkdirAll(dir, 0755); err != nil {
        return err
    }

    file, err := os.Create(fullPath)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = io.Copy(file, content)
    return err
}