$TTL    604800
@       IN      SOA     ns-01.startup.ephec-ti.be. admin.startup.ephec-ti.be. (
                              1         ; Serial (incrementer a chaque modif)
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
; Serveurs de noms (NS)
@       IN      NS      ns-01.startup.ephec-ti.be.

; Enregistrements A (Les adresses IPv4)
ns-01   IN      A       10.1.20.11
log-01  IN      A       10.1.20.12
bh-01   IN      A       10.1.20.13
ntp-01  IN      A       10.1.20.14
proxmox IN      A       10.1.20.50
