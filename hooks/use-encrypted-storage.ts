"use client"

import { useAuth } from "./use-auth"

export function useEncryptedStorage() {
  const { getCurrentPassword, getCurrentAccountKey } = useAuth()

  const generateCipherKey = (password: string): string => {
    let key = ""
    for (let i = 0; i < password.length; i++) {
      key += String.fromCharCode(password.charCodeAt(i) + 17)
    }
    return key.repeat(10).substring(0, 100)
  }

  const encryptData = (data: string, password: string): string => {
    const key = generateCipherKey(password)
    let encrypted = ""

    for (let i = 0; i < data.length; i++) {
      const dataChar = data.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      const encryptedChar = String.fromCharCode((dataChar + keyChar) % 65536)
      encrypted += encryptedChar
    }

    return btoa(encrypted)
  }

  const decryptData = (encryptedData: string, password: string): string => {
    try {
      const key = generateCipherKey(password)
      const encrypted = atob(encryptedData)
      let decrypted = ""

      for (let i = 0; i < encrypted.length; i++) {
        const encryptedChar = encrypted.charCodeAt(i)
        const keyChar = key.charCodeAt(i % key.length)
        const decryptedChar = String.fromCharCode((encryptedChar - keyChar + 65536) % 65536)
        decrypted += decryptedChar
      }

      return decrypted
    } catch {
      return ""
    }
  }

  const saveEncryptedData = (data: any): boolean => {
    try {
      const password = getCurrentPassword()
      const accountKey = getCurrentAccountKey()
      if (!password || !accountKey) return false

      const jsonData = JSON.stringify(data)
      const encrypted = encryptData(jsonData, password)

      // Get all accounts
      const accountsData = localStorage.getItem("dhap_accounts")
      const accounts = accountsData ? JSON.parse(accountsData) : {}

      // Update this account's data
      accounts[accountKey] = encrypted
      localStorage.setItem("dhap_accounts", JSON.stringify(accounts))

      return true
    } catch {
      return false
    }
  }

  const loadEncryptedData = (defaultValue: any = null): any => {
    try {
      const password = getCurrentPassword()
      const accountKey = getCurrentAccountKey()
      if (!password || !accountKey) return defaultValue

      const accountsData = localStorage.getItem("dhap_accounts")
      if (!accountsData) return defaultValue

      const accounts = JSON.parse(accountsData)
      const encryptedData = accounts[accountKey]
      if (!encryptedData) return defaultValue

      const decrypted = decryptData(encryptedData, password)
      return JSON.parse(decrypted)
    } catch {
      return defaultValue
    }
  }

  return {
    saveEncryptedData,
    loadEncryptedData,
    encryptData,
    decryptData,
  }
}
