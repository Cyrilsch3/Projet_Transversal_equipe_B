$TTL    604800
@       IN      SOA     ns-01.grp-b.ephec-ti.be. admin.grp-b.ephec-ti.be. (
                              3         ; Serial 
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
; Serveurs de noms (NS)
@       IN      NS      ns-01.grp-b.ephec-ti.be.

; --- Enregistrements de l'infrastructure ---
ns-01   IN      A       10.1.20.11
log-01  IN      A       10.1.20.12
bh-01   IN      A       10.1.20.13
ntp-01  IN      A       10.1.20.14
proxmox IN      A       10.1.1.50

; --- Enregistrements de la DMZ (Serveur Web) ---
srv-02  IN      A       10.1.55.10

; --- Raccourcis pour le site web ---
@       IN      A       10.1.55.10
www     IN      CNAME   srv-02