# CCM-claude-code-mods

Cinq mods pour Claude Code, utilisables dans n'importe quel projet. Un mod est un petit ajout
qui change ce que Claude Code affiche ou ce qu'il accepte de faire.

| Mod | Ce qu'il fait |
| --- | --- |
| **jauge** | Une barre au-dessus de la zone de saisie : remplissage du fil (en %) et quota sur 5 heures. Prévient à 85 %. Dans un projet Claude (application Projets), ajoute aussi une petite ligne « 📊 Jauge » en bas de chaque message des fils, puisque la barre n'y est pas visible. |
| **chrono** | Dans la ligne d'état : durée réelle du dernier tour et nombre d'appels d'outils, lus sur l'horloge. |
| **sonnette** | Une notification quand Claude a fini un travail de plus d'une minute. |
| **garde-fou** | Refuse les commandes qu'on ne peut pas défaire (changer l'adresse distante git, pousser en force ou sur main, supprimer en masse, effacer des changements non sauvegardés) et dit pourquoi. |
| **bilan** | La commande `/bilan` : coût, durée, remplissage du fil et quotas de la session. |

Tous les chiffres sont lus sur Claude Code lui-même, jamais estimés.

## Installer

Dans Claude Code, à l'invite, une ligne par mod voulu :

```
/plugin install jauge --marketplace graphixxgeek-boop/CCM-claude-code-mods
/plugin install chrono --marketplace graphixxgeek-boop/CCM-claude-code-mods
/plugin install sonnette --marketplace graphixxgeek-boop/CCM-claude-code-mods
/plugin install garde-fou --marketplace graphixxgeek-boop/CCM-claude-code-mods
/plugin install bilan --marketplace graphixxgeek-boop/CCM-claude-code-mods
```

Répondre `y` pour ajouter la source, puis choisir la portée.

Depuis un terminal : `claude plugin install <mod> --marketplace graphixxgeek-boop/CCM-claude-code-mods`.

Dans l'application de bureau : cliquer sur + à côté de la zone de saisie, puis Plugins, Add marketplace
avec `graphixxgeek-boop/CCM-claude-code-mods`, puis Add plugin.

Le dépôt est privé : pour installer, GitHub doit être configuré sur l'ordinateur.

`/plugin` liste les mods chargés et permet de les éteindre.

## Limite connue du garde-fou

Il lit le texte entier de la commande. Une commande qui contient seulement le texte d'une commande
interdite (par exemple dans un fichier qu'on écrit) est refusée aussi. C'est voulu : mieux vaut un
refus de trop qu'une commande irréversible qui passe.

## Vérifier

```
claude plugin validate <dossier du mod>
claude plugin test garde-fou
```
